import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import os
import gc

def normalize_label_column(df, dataset_name):
    """Finds the target column and renames it to 'label' to prevent KeyErrors."""
    possible_names = ['label', 'Label', 'class', 'Class', 'target', 'is_malware', 'malware']
    for col in possible_names:
        if col in df.columns:
            df.rename(columns={col: 'label'}, inplace=True)
            print(f"✅ {dataset_name}: Found target column '{col}', renamed to 'label'.")
            return df
    raise KeyError(f"Could not identify the label column in {dataset_name}.")

def train_static_analyzer():
    print("🚀 Starting Massive Hybrid Training (Memory Optimized & Shuffled)...")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    ember_train_path = os.path.join(base_dir, 'dataset', 'Ember', 'train_ember_2018_v2_features.parquet')
    ember_test_path = os.path.join(base_dir, 'dataset', 'Ember', 'test_ember_2018_v2_features.parquet')
    bodmas_path = os.path.join(base_dir, 'dataset', 'Bodmas', 'bodmas.parquet')

    # --- UPGRADE: Pre-flight file checks ---
    datasets_to_check = [
        (ember_train_path, 'EMBER Train'),
        (ember_test_path, 'EMBER Test'),
        (bodmas_path, 'BODMAS')
    ]
    for path, name in datasets_to_check:
        if not os.path.exists(path):
            print(f"❌ Error: {name} dataset not found at {path}")
            return

    # --- UPGRADE: Forced pyarrow engine for maximum speed ---
    print(f"\n📂 Loading EMBER Train...")
    df_ember_train = pd.read_parquet(ember_train_path, engine='pyarrow')
    df_ember_train = normalize_label_column(df_ember_train, "EMBER Train")

    print(f"📂 Loading EMBER Test...")
    df_ember_test = pd.read_parquet(ember_test_path, engine='pyarrow')
    df_ember_test = normalize_label_column(df_ember_test, "EMBER Test")
    
    print(f"📂 Loading BODMAS...")
    df_bodmas = pd.read_parquet(bodmas_path, engine='pyarrow')
    df_bodmas = normalize_label_column(df_bodmas, "BODMAS")

    print("\n🔄 Merging feature datasets...")
    master_df = pd.concat([df_ember_train, df_ember_test, df_bodmas], ignore_index=True)

    # 🧹 RAM CLEAR STEP 1
    
    print("🧹 Flushing old dataframes from RAM...")
    del df_ember_train
    del df_ember_test
    del df_bodmas
    gc.collect()

    print("🧹 Cleaning Labels (Removing unlabeled data)...")
    master_df = master_df[master_df['label'].isin([0, 1])] 
    
    # 🔀 THE OVERFITTING FIX: Shuffle the entire dataset before doing anything else
    print("🔀 Shuffling dataset to completely mix EMBER and BODMAS malware...")
    master_df = master_df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    y = master_df['label'].values.astype('float32')
    X_raw = master_df.drop(columns=['label'])
    
    # 🧹 RAM CLEAR STEP 2
    del master_df
    gc.collect()

    print("✂️ Dropping non-numeric columns (hashes, strings)...")
    X_raw = X_raw.select_dtypes(include=[np.number])
    
    print("🗜️ Downcasting to float32 to save RAM...")
    X_raw = X_raw.astype('float32')

    print(f"📊 Final Cleaned Dataset: {len(X_raw)} samples, {X_raw.shape[1]} numeric features.")

    print("🧹 Cleaning NaNs and Infinities...")
    X_raw = X_raw.replace([np.inf, -np.inf], np.nan).fillna(0)

    print("⚖️ Scaling features...")
    scaler = StandardScaler() 
    X = scaler.fit_transform(X_raw)

    # 🧹 RAM CLEAR STEP 3
    del X_raw
    gc.collect()

    # Neural Network Architecture
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(X.shape[1],)),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.4),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])

    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    # 🛑 EARLY STOPPING FIX: Stop training when validation loss stops dropping
    
    print("\n⚡ Training Hybrid Static Model...")
    early_stop = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss', 
        patience=3,                 # If it doesn't improve for 3 epochs, stop.
        restore_best_weights=True   # Roll back to the best performing epoch.
    )

    model.fit(
        X, y, 
        epochs=15, 
        batch_size=512, 
        validation_split=0.15, 
        shuffle=True,
        callbacks=[early_stop]      # Attach the early stopping rule here
    )

    # Save the model
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    output_path = os.path.join(models_dir, 'file-model.h5')
    
    model.save(output_path)
    print(f"\n✨ Success! Massive file model saved to {output_path}")

if __name__ == "__main__":
    train_static_analyzer()