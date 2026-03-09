import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import os

def train_dike_pro():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'dataset', 'dike', 'dike_extracted_features.csv')

    print("🚀 Training HIGH-ACCURACY Dike Model...")
    df = pd.read_csv(csv_path)
    
    # 🚨 CRITICAL: Shuffle everything to fix the perfect val_accuracy bug
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    X = df.drop(columns=['label']).values.astype('float32')
    y = df['label'].values.astype('float32')

    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Deeper, more sophisticated architecture
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(X.shape[1],)),
        
        tf.keras.layers.Dense(512),
        tf.keras.layers.LeakyReLU(alpha=0.1),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.4),
        
        tf.keras.layers.Dense(256),
        tf.keras.layers.LeakyReLU(alpha=0.1),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),
        
        tf.keras.layers.Dense(128),
        tf.keras.layers.LeakyReLU(alpha=0.1),
        
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])

    # Slower learning rate for better convergence
    opt = tf.keras.optimizers.Adam(learning_rate=0.0005)
    model.compile(optimizer=opt, loss='binary_crossentropy', metrics=['accuracy'])

    # Stop when it hits peak accuracy
    early_stop = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

    model.fit(X, y, epochs=20, batch_size=64, validation_split=0.2, callbacks=[early_stop])

    os.makedirs(os.path.join(base_dir, 'models'), exist_ok=True)
    model.save(os.path.join(base_dir, 'models', 'dike-model.h5'))
    print("✨ High-accuracy Dike model saved!")

if __name__ == "__main__":
    train_dike_pro()