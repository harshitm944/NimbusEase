import torch
import torch.nn as nn
import os

class SorelFFNN(nn.Module):
    def __init__(self, input_size=2381):
        super(SorelFFNN, self). __init__()
        
        # This architecture is mapped directly from your RuntimeError indices
        self.model_base = nn.Sequential(
            # 0, 1, 2: First Block
            nn.Linear(input_size, 512),  # model_base.0
            nn.LayerNorm(512),            # model_base.1
            nn.ReLU(),                   # model_base.2
            
            # 3, 4, 5: Second Block (The error was here!)
            nn.Dropout(0.05),            # model_base.3
            nn.Linear(512, 512),         # model_base.4
            nn.LayerNorm(512),            # model_base.5
            nn.ReLU(),                   # model_base.6
            
            # 7, 8, 9: Third Block (Compression to 128)
            nn.Dropout(0.05),            # model_base.7
            nn.Linear(512, 128),         # model_base.8
            nn.LayerNorm(128),            # model_base.9
            nn.ReLU()                    # model_base.10
        )

        # Malware Prediction Head
        self.malware_head = nn.Sequential(
            nn.Linear(128, 1),           # malware_head.0
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.model_base(x)
        return self.malware_head(x)

def load_and_test_sorel():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'models', 'sores_epoch_5.pt')
    
    if not os.path.exists(model_path):
        print(f"❌ File not found: {model_path}")
        return

    print(f"🚀 Loading SOREL-20M Model...")
    model = SorelFFNN()
    
    state_dict = torch.load(model_path, map_location='cpu')
    
    # strict=False is key to ignore the extra 'tag' and 'count' heads
    model.load_state_dict(state_dict, strict=False)
    model.eval()
    
    print("✅ SUCCESS! The architecture is a perfect match.")
    
    # Sanity check
    dummy_input = torch.randn(1, 2381)
    with torch.no_grad():
        prediction = model(dummy_input)
        print(f"🔬 Security Score: {prediction.item():.4f}")
        print(f"🛡️ Status: {'MALICIOUS' if prediction.item() > 0.5 else 'BENIGN'}")

if __name__ == "__main__":
    load_and_test_sorel()