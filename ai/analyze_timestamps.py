import pandas as pd
import os

def print_terminal_barchart(series, max_bar_width=50):
    """Generates an ASCII bar chart in the terminal from a Pandas Series."""
    print("\n📊 Malware Growth Over Time (Terminal Graph)")
    print("-" * 70)
    
    max_val = series.max()
    
    for label, value in series.items():
        # Calculate how many block characters to draw based on the max value
        if max_val > 0:
            bar_length = int((value / max_val) * max_bar_width)
        else:
            bar_length = 0
            
        bar = '█' * bar_length
        
        # Print the Year, the Bar, and the exact Count, nicely formatted
        print(f"{label} | {bar:<{max_bar_width}} {value:,}")
    print("-" * 70)

def analyze_malware_timeline():
    print("🕒 Starting BODMAS Timestamp Analysis...")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    timestamp_path = os.path.join(base_dir, 'dataset', 'Bodmas', 'bodmas-timestamps.parquet')
    
    if not os.path.exists(timestamp_path):
        raise FileNotFoundError(f"Missing Timestamp dataset: {timestamp_path}")

    # Load the timestamps
    df_times = pd.read_parquet(timestamp_path)
    
    time_col = None
    for col in df_times.columns:
        if 'time' in col.lower() or 'date' in col.lower():
            time_col = col
            break
            
    if time_col:
        print(f"🔄 Converting '{time_col}' to readable dates...")
        df_times['readable_date'] = pd.to_datetime(df_times[time_col], errors='coerce') 
        df_times = df_times.dropna(subset=['readable_date'])
        
        # Calculate statistics
        oldest = df_times['readable_date'].min()
        newest = df_times['readable_date'].max()
        
        print("\n📈 Timestamp Insights:")
        print(f"Total valid timestamp records: {len(df_times):,}")
        print(f"Oldest malware sample from: {oldest}")
        print(f"Newest malware sample from: {newest}")
        
        # Group by year to see malware trends
        yearly_counts = df_times['readable_date'].dt.year.value_counts().sort_index()
        
        # Print the visual graph in the log
        print_terminal_barchart(yearly_counts)
        
    else:
        print("\n⚠️ Could not automatically detect a time/date column.")

if __name__ == "__main__":
    analyze_malware_timeline()