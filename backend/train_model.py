import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train():
    # Load dataset
    df = pd.read_csv('backend/dataset/Bangalore.csv')
    
    # Preprocessing
    # 1. Replace 9 with 0 (assuming 9 means not mentioned/absent)
    amenity_cols = df.columns[5:]
    df[amenity_cols] = df[amenity_cols].replace(9, 0)
    
    # 2. Location Cleaning
    df['Location'] = df['Location'].str.strip()
    location_stats = df['Location'].value_counts()
    locations_less_than_10 = location_stats[location_stats <= 10]
    df['Location'] = df['Location'].apply(lambda x: 'Other' if x in locations_less_than_10 else x)
    
    # 3. Encoding Location
    le = LabelEncoder()
    df['Location'] = le.fit_transform(df['Location'])
    
    # Save the label encoder classes for later use
    joblib.dump(le, 'backend/models/location_encoder.joblib')
    
    # 4. Features and Target
    X = df.drop('Price', axis=1)
    y = np.log1p(df['Price']) # Log transformation
    
    # 5. Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 6. Train Model
    model = xgb.XGBRegressor(
        n_estimators=1000,
        learning_rate=0.01,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        n_jobs=-1,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # 7. Evaluate
    y_pred = model.predict(X_test)
    from sklearn.metrics import r2_score, mean_absolute_error
    score = r2_score(y_test, y_pred)
    mae = mean_absolute_error(np.expm1(y_test), np.expm1(y_pred))
    print(f"Model R^2 Score (on log price): {score}")
    print(f"Mean Absolute Error (on original price): {mae}")
    
    # 8. Save Model
    joblib.dump(model, 'backend/models/house_price_model.joblib')
    
    # Save feature names
    joblib.dump(list(X.columns), 'backend/models/feature_names.joblib')
    
    print("Model and artifacts saved to backend/models/")

if __name__ == "__main__":
    if not os.path.exists('backend/models'):
        os.makedirs('backend/models')
    train()
