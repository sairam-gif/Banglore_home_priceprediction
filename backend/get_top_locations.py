import pandas as pd
import json

df = pd.read_csv('backend/dataset/Bangalore.csv')
df['Location'] = df['Location'].str.strip()
location_counts = df['Location'].value_counts()
top_locations = location_counts[location_counts > 10].index.tolist()

print(f"Total locations with > 10 occurrences: {len(top_locations)}")
print("Sample:", top_locations[:10])

with open('backend/utils/top_locations.json', 'w') as f:
    json.dump(top_locations, f)
