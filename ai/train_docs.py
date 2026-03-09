import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import PowerTransformer
from sklearn.model_selection import train_test_split
from sklearn.utils import class_weight
import numpy as np
import os

def train_pdf_ultra():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'dataset', 'pdfmalware.csv')

    print("📄 Loading PDF Dataset for Ultra-Training...")
    if not os.path.exists(csv_path):
        print(f"❌ Error: Dataset not found at {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    
    # 🧹 1. Drop duplicates to prevent train/test overlap leakage
    df = df.drop_duplicates()
    
    # Find the target label
    label_col = next((c for c in df.columns if c.lower() in ['class', 'label']), None)
    if not label_col:
        print("❌ Error: Could not find label column.")
        return

    # Map target to 1 (Malicious) and 0 (Benign)
    y = df[label_col].apply(lambda x: 1 if str(x).lower() in ['malicious', 'yes', '1', '1.0'] else 0).values
    
    # 🛑 2. PLUG THE DATA LEAK: Aggressively drop ID and Hash columns
    leak_cols = [c for c in df.columns if any(x in c.lower() for x in ['filename', 'md5', 'sha', 'hash', 'id'])]
    if leak_cols:
        print(f"🧹 Dropping data leak columns: {leak_cols}")
    X = df.drop(columns=[label_col] + leak_cols, errors='ignore')
    
    # 🛠️ 3. FIX PANDAS WARNING: Convert "yes"/"no" strings safely, then drop the rest
    object_cols = X.select_dtypes(include=['object', 'string']).columns
    for col in object_cols:
        # Convert explicit yes/no, leave others alone
        X[col] = X[col].apply(lambda x: 1 if str(x).lower() == 'yes' else (0 if str(x).lower() == 'no' else x))
    
    # Now strictly keep ONLY numeric data. This permanently destroys any remaining string leaks.
    X = X.select_dtypes(include=['number'])
    X = X.fillna(0)
    
    print(f"📊 Final feature count (Strictly Numeric): {X.shape[1]}")

    # 4. PowerTransformer: Handles extreme skewness in PDF metadata better than RobustScaler
    scaler = PowerTransformer(method='yeo-johnson')
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.15, random_state=42)

    # 5. Calculate Class Weights
    weights = class_weight.compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
    weight_dict = {0: weights[0], 1: weights[1]}

    # 6. Build Architecture 
    inputs = tf.keras.Input(shape=(X_train.shape[1],))
    
    x = tf.keras.layers.Dense(256, activation='swish')(inputs)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    
    # Residual Block
    shortcut = tf.keras.layers.Dense(128)(x)
    x = tf.keras.layers.Dense(128, activation='swish')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Add()([x, shortcut])
    
    x = tf.keras.layers.Dense(64, activation='swish')(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    
    outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)
    model = tf.keras.Model(inputs, outputs)

    # 🛡️ 7. ADVANCED METRICS ADDED HERE
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4), 
        loss='binary_crossentropy', 
        metrics=[
            'accuracy',
            tf.keras.metrics.Precision(name='precision'), # How many "Malicious" flags were actually malware?
            tf.keras.metrics.Recall(name='recall'),       # Out of all real malware, how many did it catch?
            tf.keras.metrics.AUC(name='auc')              # Overall ability to distinguish classes
        ]
    )

    # 8. Optimizer Callbacks
    lr_reducer = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', patience=3, factor=0.5)
    early_stop = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=6, restore_best_weights=True)

    print("🚀 Running Ultra-Training with Advanced Metrics (20 Epochs)...")
    model.fit(
        X_train, y_train, 
        epochs=20, 
        batch_size=64, 
        validation_data=(X_test, y_test), 
        class_weight=weight_dict, 
        callbacks=[lr_reducer, early_stop]
    )

    # 9. Save the Model
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    output_path = os.path.join(models_dir, 'pdf-model.h5')
    
    model.save(output_path)
    print(f"✨ PDF Defense Model saved to {output_path}")

if __name__ == "__main__":
    train_pdf_ultra()