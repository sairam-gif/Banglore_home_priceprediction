from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import json
from typing import List, Dict

app = FastAPI(title="Bangalore House Price Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the backend directory path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

# Load Model and Artifacts
MODEL_PATH = os.path.join(BACKEND_DIR, "models", "house_price_model.joblib")
ENCODER_PATH = os.path.join(BACKEND_DIR, "models", "location_encoder.joblib")
FEATURES_PATH = os.path.join(BACKEND_DIR, "models", "feature_names.joblib")
DATASET_PATH = os.path.join(BACKEND_DIR, 'dataset', 'Bangalore.csv')

print(f"Backend Directory: {BACKEND_DIR}")
print(f"Model Path: {MODEL_PATH}")
print(f"Dataset Path: {DATASET_PATH}")

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    le = joblib.load(ENCODER_PATH)
    feature_names = joblib.load(FEATURES_PATH)
    print("✓ Model and artifacts loaded successfully")
else:
    model = None
    le = None
    feature_names = None
    print(f"✗ Warning: Model files not found at {MODEL_PATH}")

# Load Dataset for analytics
if os.path.exists(DATASET_PATH):
    df = pd.read_csv(DATASET_PATH)
    df['Location'] = df['Location'].str.strip()
    print(f"✓ Dataset loaded successfully ({len(df)} records)")
else:
    print(f"✗ Error: Dataset not found at {DATASET_PATH}")
    df = pd.DataFrame()

# Load Location Coordinates
LOCATIONS_COORDS_PATH = os.path.join(BACKEND_DIR, "utils", "locations_coordinates.json")
location_coordinates = {}
if os.path.exists(LOCATIONS_COORDS_PATH):
    with open(LOCATIONS_COORDS_PATH, 'r') as f:
        coords_list = json.load(f)
        for loc in coords_list:
            location_coordinates[loc['name']] = {
                'latitude': loc['latitude'],
                'longitude': loc['longitude']
            }

class PredictionRequest(BaseModel):
    Area: float
    Location: str
    No_of_Bedrooms: int
    Resale: int
    Amenities: Dict[str, int]

class FilterRequest(BaseModel):
    max_budget: float
    bhk_types: List[str]
    area_sqft: float
    amenities: List[str]
    location_name: str | None = None



@app.get("/")
async def root():
    return {"message": "Bangalore House Price Prediction API is running"}

@app.get("/api/locations")
async def get_locations():
    # Only return locations that the model knows (from LabelEncoder classes)
    if le:
        return sorted(list(le.classes_))
    return sorted(df['Location'].unique().tolist())

@app.get("/api/bhk-values")
async def get_bhk_values():
    # Return unique BHK values from dataset, sorted, and filtering out invalid ones if any
    bhk_values = sorted([int(x) for x in df['No. of Bedrooms'].unique() if x > 0])
    return bhk_values

@app.get("/api/analytics/location-trends")
async def location_trends(location: str):
    # Filter data for the specific location
    loc_df = df[df['Location'] == location].copy()
    if loc_df.empty:
        loc_df = df.copy()
    
    # Calculate averages per BHK
    trends = loc_df.groupby('No. of Bedrooms').agg({
        'Price': 'mean',
        'Area': 'mean'
    }).reset_index()
    trends.columns = ['BHK', 'AveragePrice', 'AverageArea']
    trends['PricePerSqft'] = trends['AveragePrice'] / trends['AverageArea']
    trends = trends.sort_values(by='BHK')
    
    # Convert to native Python types to avoid JSON serialization errors
    return trends.astype(object).to_dict(orient='records')

@app.post("/api/predict")
async def predict(req: PredictionRequest):
    if not model or not le:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare input data
        input_data = {
            'Area': req.Area,
            'Location': req.Location,
            'No. of Bedrooms': req.No_of_Bedrooms,
            'Resale': req.Resale
        }
        
        # Merge with amenities
        input_data.update(req.Amenities)
        
        # Ensure all features exist
        full_input = {}
        for feat in feature_names:
            if feat in input_data:
                full_input[feat] = input_data[feat]
            elif feat == 'Location':
                # Handle unknown location
                loc = req.Location if req.Location in le.classes_ else 'Other'
                full_input['Location'] = le.transform([loc])[0]
            else:
                full_input[feat] = 0
        
        # Convert to DataFrame
        input_df = pd.DataFrame([full_input])
        
        # Prediction (on log scale)
        log_price = model.predict(input_df)[0]
        price = np.expm1(log_price)
        
        # Confidence score (dummy for now, or based on model stats)
        confidence = 0.85 # Heuristic
        
        return {
            "predicted_price": float(price),
            "formatted_price": f"₹ {float(price)/100000:.2f} Lakhs" if price < 10000000 else f"₹ {float(price)/10000000:.2f} Crores",
            "confidence": float(confidence)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/analytics/top-localities")
async def top_localities():
    # Top 10 most expensive areas (average price per sqft)
    temp_df = df.copy()
    temp_df['PricePerSqft'] = temp_df['Price'] / temp_df['Area']
    avg_prices = temp_df.groupby('Location')['PricePerSqft'].agg(['mean', 'count']).reset_index()
    # Filter for areas with at least 5 listings
    top_10 = avg_prices[avg_prices['count'] >= 5].sort_values(by='mean', ascending=False).head(10)
    
    return top_10.astype(object).to_dict(orient='records')

@app.get("/api/analytics/affordable-localities")
async def affordable_localities():
    temp_df = df.copy()
    temp_df['PricePerSqft'] = temp_df['Price'] / temp_df['Area']
    avg_prices = temp_df.groupby('Location')['PricePerSqft'].agg(['mean', 'count']).reset_index()
    bottom_10 = avg_prices[avg_prices['count'] >= 5].sort_values(by='mean', ascending=True).head(10)
    
    return bottom_10.astype(object).to_dict(orient='records')

@app.get("/api/location/{location_name}")
async def get_location_details(location_name: str):
    """Get detailed information for a specific location"""
    
    # Check if location exists in coordinates
    if location_name in location_coordinates:
        coords = location_coordinates[location_name]
    else:
        # Try fuzzy match
        for coord_loc_name, coords in location_coordinates.items():
            if location_name.lower() in coord_loc_name.lower() or coord_loc_name.lower() in location_name.lower():
                location_name = coord_loc_name
                break
        else:
            raise HTTPException(status_code=404, detail="Location not found")
    
    # Get price information
    temp_df = df[df['Location'] == location_name].copy()
    if temp_df.empty:
        # Try fuzzy match on dataframe too
        temp_df = df[df['Location'].str.contains(location_name, case=False, na=False)].copy()
    
    if temp_df.empty:
        raise HTTPException(status_code=404, detail="No data available for this location")
    
    # Calculate statistics
    temp_df['PricePerSqft'] = temp_df['Price'] / temp_df['Area']
    
    return {
        'name': location_name,
        'latitude': float(coords['latitude']),
        'longitude': float(coords['longitude']),
        'average_price': float(temp_df['Price'].mean()),
        'average_area': float(temp_df['Area'].mean()),
        'average_price_per_sqft': float(temp_df['PricePerSqft'].mean()),
        'total_listings': int(len(temp_df)),
        'min_price': float(temp_df['Price'].min()),
        'max_price': float(temp_df['Price'].max()),
        'bedrooms': [int(x) for x in sorted(temp_df['No. of Bedrooms'].unique().tolist())]
    }

@app.get("/api/map-data")
async def get_map_data():
    # Return comprehensive map data with all locations
    results = []
    temp_df = df.copy()
    
    # Calculate average Price per location
    avg_prices = temp_df.groupby('Location').agg({
        'Price': 'mean',
        'Area': 'count' # Use count of listings
    }).reset_index()
    avg_prices.columns = ['Location', 'mean_price', 'count']
    
    # Create map data with coordinates and prices
    for _, row in avg_prices.iterrows():
        location_name = row['Location']
        
        # Try to find coordinates for this location
        if location_name in location_coordinates:
            coords = location_coordinates[location_name]
            results.append({
                'name': location_name,
                'lat': float(coords['latitude']),
                'lon': float(coords['longitude']),
                'avgPrice': int(round(float(row['mean_price']))),
                'count': int(row['count'])
            })
        else:
            # Try fuzzy match for locations that might have slight variations
            for coord_loc_name, coords in location_coordinates.items():
                if location_name.lower() in coord_loc_name.lower() or coord_loc_name.lower() in location_name.lower():
                    results.append({
                        'name': location_name,
                        'lat': float(coords['latitude']),
                        'lon': float(coords['longitude']),
                        'avgPrice': int(round(float(row['mean_price']))),
                        'count': int(row['count'])
                    })
                    break
    
    return results

@app.post("/api/filter_properties")
async def filter_properties(req: FilterRequest):
    if not model or not le or not feature_names:
        raise HTTPException(status_code=500, detail="Model artifacts not loaded")

    print(f"\n=== FILTER REQUEST ===")
    print(f"Max Budget: {req.max_budget}")
    print(f"BHK Types: {req.bhk_types}")
    print(f"Area SqFt: {req.area_sqft}")
    print(f"Amenities: {req.amenities}")
    print(f"Feature Names Count: {len(feature_names)}")

    # Prepare known amenities from feature_names
    known_amenities = [f for f in feature_names if f not in ['Area', 'Location', 'No. of Bedrooms', 'Resale', 'Price']]
    print(f"Known Amenities: {known_amenities}")

    # Filter locations if specified
    locations_to_consider = []
    if req.location_name:
        if req.location_name in le.classes_:
            locations_to_consider.append(req.location_name)
        else:
            raise HTTPException(status_code=404, detail=f"Specified location '{req.location_name}' not found.")
    else:
        locations_to_consider = list(le.classes_) # Consider all known locations
    
    print(f"Locations to consider: {len(locations_to_consider)}")

    # Store results
    matched_properties = []

    for loc_name in locations_to_consider:
        loc_encoded = le.transform([loc_name])[0]
        loc_coords = location_coordinates.get(loc_name)
        if not loc_coords:
            continue # Skip if no coordinates for this location

        for bhk_type_str in req.bhk_types:
            # Handle '4+' BHK logic
            if bhk_type_str == '4+':
                bhk_options = [4, 5] # Simulate 4 and 5 BHK for '4+'
            else:
                bhk_options = [int(bhk_type_str)]

            for bhk_val in bhk_options:
                # Construct base input features, assume Resale=0 (new property)
                base_input = {
                    'Area': req.area_sqft,
                    'Location': loc_encoded,
                    'No. of Bedrooms': bhk_val,
                    'Resale': 0, # Assuming new properties for filtering
                }

                # Add amenities (set to 1 if requested, 0 otherwise)
                for amenity in known_amenities:
                    base_input[amenity] = 1 if amenity in req.amenities else 0
                
                # Ensure all features are present in the order expected by the model
                full_input_features = []
                for feat_name in feature_names:
                    if feat_name == 'Location':
                        full_input_features.append(base_input.get(feat_name, 0)) # Use encoded location
                    elif feat_name == 'No. of Bedrooms':
                        full_input_features.append(base_input.get(feat_name, 0))
                    elif feat_name == 'Area':
                        full_input_features.append(base_input.get(feat_name, 0))
                    elif feat_name == 'Resale':
                        full_input_features.append(base_input.get(feat_name, 0))
                    elif feat_name.startswith('Location_') and feat_name.replace('Location_', '') == loc_name:
                        full_input_features.append(1) # One-hot encoding for location
                    elif feat_name in known_amenities:
                         full_input_features.append(base_input.get(feat_name, 0))
                    else:
                        full_input_features.append(0) # Default for other features not directly from input

                # Make prediction
                try:
                    input_df = pd.DataFrame([full_input_features], columns=feature_names)
                    log_price = model.predict(input_df)[0]
                    predicted_price = np.expm1(log_price)
                except Exception as e:
                    print(f"Error predicting for {loc_name}, {bhk_val} BHK, {req.area_sqft} sqft: {e}")
                    predicted_price = 0 # Mark as invalid price

                # Calculate recommendation score
                score = 0
                if predicted_price > 0:
                    # Calculate amenities to pricing ratio
                    # Using (count + 1) / (price in lakhs) to avoid zero and get a meaningful ratio
                    matched_amenities_count = sum(1 for amenity_feat in known_amenities if amenity_feat in req.amenities)
                    price_in_lakhs = predicted_price / 100000
                    amenity_price_ratio = (matched_amenities_count + 1) / price_in_lakhs
                    
                    # Primary score component: Amenity/Price Ratio (scaled for significance)
                    score += amenity_price_ratio * 100 
                    
                    # Secondary score component: Budget closeness
                    price_diff = abs(predicted_price - req.max_budget)
                    if price_diff <= req.max_budget * 0.10: # Within 10% of budget
                        score += 30
                    elif price_diff <= req.max_budget * 0.25: # Within 25% of budget
                        score += 15
                    
                    # BHK match bonus
                    score += 10


                # Add to results if within budget and has a valid price
                if predicted_price > 0 and predicted_price <= req.max_budget * 1.20: # Allow slightly over budget for recommendations
                    matched_properties.append({
                        "location_name": loc_name,
                        "latitude": float(loc_coords['latitude']),
                        "longitude": float(loc_coords['longitude']),
                        "predicted_price": float(predicted_price),
                        "bhk": int(bhk_val),
                        "area_sqft": float(req.area_sqft),
                        "amenities": req.amenities,
                        "recommendation_score": float(score)
                    })

    # Sort by recommendation score (descending) and then by price (ascending)
    matched_properties.sort(key=lambda x: (x['recommendation_score'], -x['predicted_price']), reverse=True)
    
    print(f"Total matched properties: {len(matched_properties)}")
    if len(matched_properties) > 0:
        print(f"First result: {matched_properties[0]}")
    print(f"=== END FILTER REQUEST ===\n")
    
    return matched_properties

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
