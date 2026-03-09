import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import os

def train_network_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Path to your CIC-IDS Parquet file
    parquet_path = os.path.join(base_dir, 'dataset', 'cic-collection.parquet')

    if not os.path.exists(parquet_path):
        print(f"❌ Error: Network dataset not found at {parquet_path}")
        return

    print("🌐 Training Network Intrusion Model (CIC-IDS) from Parquet...")
    
    # Read the parquet file directly using the pyarrow engine
    df = pd.read_parquet(parquet_path, engine='pyarrow')

    # 1. Clean column names (strip spaces)
    df.columns = df.columns.str.strip()
    
    # 2. Drop columns that don't help prediction (Timestamp, ID, etc.)
    df = df.drop(columns=['External IP'], errors='ignore')

    # 3. Handle infinite/NaN values (common in network traffic data)
    df = df.replace([float('inf'), float('-inf')], 0).fillna(0)

    # 4. Map Labels (e.g., 'BENIGN' vs 'DDoS')
    y = df['Label'].apply(lambda x: 0 if str(x).upper() == 'BENIGN' else 1)
    X = df.drop(columns=['Label'])

    # Ensure we only have numeric data
    X = X.select_dtypes(include=['number'])

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # 5. Build Model
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])

    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    model.fit(X_train, y_train, epochs=10, batch_size=64, validation_data=(X_test, y_test))

    # Ensure the models directory exists before saving
    os.makedirs(os.path.join(base_dir, 'models'), exist_ok=True)
    
    model.save(os.path.join(base_dir, 'models', 'network-model.h5'))
    print(f"✨ Network model saved with {X_train.shape[1]} input features!")

if __name__ == "__main__":
    train_network_model()