import os
import sys
import json
import torch
import tensorflow as tf
import numpy as np

# --- 1. SOREL-20M ARCHITECTURE ---
class SorelFFNN(torch.nn.Module):
    def __init__(self, input_size=2381):
        super(SorelFFNN, self).__init__()
        self.model_base = torch.nn.Sequential(
            torch.nn.Linear(input_size, 512), torch.nn.LayerNorm(512), torch.nn.ReLU(),
            torch.nn.Dropout(0.05), torch.nn.Linear(512, 512), torch.nn.LayerNorm(512), torch.nn.ReLU(),
            torch.nn.Dropout(0.05), torch.nn.Linear(512, 128), torch.nn.LayerNorm(128), torch.nn.ReLU()
        )
        self.malware_head = torch.nn.Sequential(torch.nn.Linear(128, 1), torch.nn.Sigmoid())
    def forward(self, x):
        return self.malware_head(self.model_base(x))

# --- 2. LOAD FILE-SPECIFIC MODELS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load the "Knowledge" from your datasets
hybrid_model = tf.keras.models.load_model(os.path.join(MODELS_DIR, 'file-model.h5')) # BODMAS/EMBER
pdf_model = tf.keras.models.load_model(os.path.join(MODELS_DIR, 'pdf-model.h5'))       # PDFMalware2022
sores_model = SorelFFNN()
sores_model.load_state_dict(torch.load(os.path.join(MODELS_DIR, 'sores_epoch_5.pt'), map_location='cpu'), strict=False)
sores_model.eval()

def scan_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    report = {"filename": os.path.basename(file_path), "status": "SAFE", "score": 0.0, "engine": ""}

    try:
        if ext in ['.exe', '.dll']:
            # Combine BODMAS (Hybrid) and SoReL-20M
            # Features are 2381 for both
            features = np.zeros((1, 2381)).astype('float32') # Placeholder for real extraction
            
            p1 = hybrid_model.predict(features, verbose=0)[0][0]
            with torch.no_grad():
                p2 = sores_model(torch.from_numpy(features)).item()
            
            # Weighted average for accuracy
            report["score"] = float((p1 * 0.4) + (p2 * 0.6))
            report["engine"] = "Windows-Ensemble (BODMAS+SoReL)"
            
        elif ext == '.pdf':
            # Use the PDF Expert
            features = np.zeros((1, 21)).astype('float32') # Match PDF model shape
            report["score"] = float(pdf_model.predict(features, verbose=0)[0][0])
            report["engine"] = "PDF-Expert"

        report["status"] = "MALICIOUS" if report["score"] > 0.5 else "SAFE"
        return report

    except Exception as e:
        return {"status": "ERROR", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(json.dumps(scan_file(sys.argv[1])))
        