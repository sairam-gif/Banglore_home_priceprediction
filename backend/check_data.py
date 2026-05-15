import pandas as pd
import numpy as np

df = pd.read_csv('backend/dataset/Bangalore.csv')
print("Shape:", df.shape)
print("Columns:", df.columns.tolist())
print("Price Stats:\n", df['Price'].describe())
print("Area Stats:\n", df['Area'].describe())
print("Location unique counts:", df['Location'].nunique())

# Check for 9s
amenity_cols = df.columns[5:]
print("Count of 9s in amenities:", (df[amenity_cols] == 9).sum().sum())

# Sample data
print(df.head())
