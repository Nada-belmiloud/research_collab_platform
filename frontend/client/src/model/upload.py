import pickle
import gzip
import os

# Your original file
input_file = r"C:\Users\linas\OneDrive\Desktop\hybrid_recommendation_model.pkl"
output_file = r"C:\Users\linas\OneDrive\Desktop\hybrid_recommendation_model_compressed.pkl.gz"

print(f"Original size: {os.path.getsize(input_file) / (1024*1024):.2f} MB")

# Load the model
print("Loading model...")
with open(input_file, 'rb') as f:
    model = pickle.load(f)

# Save compressed
print("Compressing...")
with gzip.open(output_file, 'wb') as f:
    pickle.dump(model, f, protocol=pickle.HIGHEST_PROTOCOL)

compressed_size = os.path.getsize(output_file) / (1024*1024)
print(f"Compressed size: {compressed_size:.2f} MB")
print(f"Saved: {(1 - compressed_size/(os.path.getsize(input_file)/(1024*1024))) * 100:.1f}% reduction")
print(f"\n✅ Compressed file saved to: {output_file}")