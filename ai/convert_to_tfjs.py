import os
import subprocess

def convert_to_tfjs():
    # Define the models you want to move into NestJS directly
    # Format: (Source H5 File, Destination Folder)
    models_to_convert = [
        ('ai/models/file-model.h5', 'models/file-analyzer-tfjs'),
        ('ai/models/pdf-model.h5', 'models/pdf-analyzer-tfjs'),
        ('ai/models/network-model.h5', 'models/security-model-tfjs')
    ]
    
    for h5_path, export_dir in models_to_convert:
        if not os.path.exists(h5_path):
            print(f"⚠️ Skipping: {h5_path} not found.")
            continue

        print(f"📦 Converting {h5_path} to TFJS...")
        os.makedirs(export_dir, exist_ok=True)
        
        try:
            # We use the tensorflowjs_converter CLI tool
            cmd = [
                'py', '-3.11', '-m', 'tensorflowjs.converters.converter',
                '--input_format', 'keras',
                h5_path,
                export_dir
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Success! Saved to {export_dir}")
            else:
                print(f"❌ Error: {result.stderr}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")

if __name__ == "__main__":
    # Ensure you have the library installed first: 
    # py -3.11 -m pip install tensorflowjs
    convert_to_tfjs()