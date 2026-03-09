import os
import pefile
import pandas as pd
import math
import numpy as np

def calculate_entropy(data):
    if not data: return 0
    entropy = 0
    for x in range(256):
        p_x = float(data.count(x))/len(data)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def extract_high_accuracy_features(file_path):
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
        
        # 1. Base Binary Features
        features = {
            'file_size': len(content),
            'total_entropy': calculate_entropy(content),
            'has_pe': 0,
            'suspicious_imports': 0,
            'num_sections': 0,
            'max_section_entropy': 0
        }

        try:
            pe = pefile.PE(data=content)
            features['has_pe'] = 1
            features['num_sections'] = pe.FILE_HEADER.NumberOfSections
            
            # Feature: Max Section Entropy (Malware often hides in high-entropy sections)
            entropies = [calculate_entropy(s.get_data()) for s in pe.sections]
            features['max_section_entropy'] = max(entropies) if entropies else 0

            # Feature: Count Suspicious API Imports
            suspicious_apis = [b'CreateRemoteThread', b'WriteProcessMemory', b'VirtualAllocEx', b'IsDebuggerPresent']
            if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
                for entry in pe.DIRECTORY_ENTRY_IMPORT:
                    for imp in entry.imports:
                        if imp.name in suspicious_apis:
                            features['suspicious_imports'] += 1
            pe.close()
        except:
            pass # Keep base features if not a PE file
            
        return features
    except:
        return None

def build_dike_dataset():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    results_dir = os.path.join(base_dir, 'dataset', 'dike', 'results')
    output_file = os.path.join(base_dir, 'dataset', 'dike', 'dike_extracted_features.csv')

    data = []
    categories = {'benign': 0, 'malware': 1}
    print("🛡️ Starting HIGH-ACCURACY Dike Extraction...")

    for category, label in categories.items():
        folder_path = os.path.join(results_dir, category)
        if not os.path.exists(folder_path): continue
        files = [f for f in os.listdir(folder_path) if not f.endswith('.Identifier')]
        
        for i, filename in enumerate(files):
            feat = extract_high_accuracy_features(os.path.join(folder_path, filename))
            if feat:
                feat['label'] = label
                data.append(feat)
            if (i + 1) % 500 == 0: print(f"   {category.upper()}: {i+1}/{len(files)} processed...")

    pd.DataFrame(data).to_csv(output_file, index=False)
    print(f"✨ Success! Saved to {output_file}")

if __name__ == "__main__":
    build_dike_dataset()