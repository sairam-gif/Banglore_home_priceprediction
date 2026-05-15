# Design Document: Bangalore House Price Prediction Platform

## 1. Project Overview
A production-ready full-stack application to predict real estate prices in Bangalore, India. It combines machine learning with a modern web interface, interactive maps, and analytics.

## 2. Technical Stack
- **Frontend:** React.js, Tailwind CSS, Recharts, React Leaflet (Map).
- **Backend:** FastAPI (Python), Scikit-Learn, XGBoost, Pandas.
- **Database:** MongoDB (for user data and saved predictions).
- **Deployment:** Docker (optional), Vercel (Frontend), Railway/Render (Backend).

## 3. Data Strategy
- **Source:** Bangalore House Price Dataset (Kaggle).
- **Features:** Price, Area, Location, No. of Bedrooms, Resale, and 30+ amenities.
- **Preprocessing:**
    - Replace '9' with '0' (amenity not mentioned).
    - Clean 'Location' names and group sparse ones into 'Other'.
    - Log transform 'Price' if skewed.
- **Geocoding:** Since the dataset lacks lat/long, we will use a pre-calculated mapping or an API like Nominatim (with caching) to plot locations on the map.

## 4. Feature Engineering
- **PricePerSqft:** To compare value across different areas.
- **AmenitiesScore:** Cumulative score based on available facilities.
- **LocationScore:** Ranked score based on historical average price in that area.

## 5. Machine Learning Model
- **Algorithm:** XGBoost Regressor (chosen for high performance on tabular data).
- **Validation:** 80/20 Train-Test split, Cross-validation.
- **Output:** Predicted price (in Lakhs/Crores) and a calculated confidence score based on model variance or error metrics.

## 6. API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict` | POST | Inputs: Area, Location, BHK, Amenities. Output: Price. |
| `/api/locations` | GET | List of all unique locations for autocomplete. |
| `/api/analytics/trends` | GET | Price trends per location. |
| `/api/analytics/rankings` | GET | Top expensive and affordable areas. |
| `/api/map/markers` | GET | Coordinates and average prices for map markers. |
| `/api/auth/register` | POST | User registration. |
| `/api/user/saved` | GET/POST | Manage saved predictions. |

## 7. UI Components
- **Search Bar:** Real-time suggestions for Bangalore localities.
- **Prediction Form:** Sliders and toggles for user input.
- **Analytics Dashboard:**
    - Bar charts for price comparisons.
    - Scatter plots for Area vs Price.
    - Pie charts for BHK distribution.
- **Interactive Map:** Heatmap showing price density across Bangalore.

## 8. Development Phases
1. **Phase 1: Backend & ML:** Data cleaning, model training, and API development.
2. **Phase 2: Database Setup:** MongoDB integration for persistence.
3. **Phase 3: Frontend Foundations:** React setup, Tailwind integration, and routing.
4. **Phase 4: Maps & Analytics:** Leaflet integration and Recharts components.
5. **Phase 5: Integration & Polishing:** Connecting frontend to backend and UI refinement.
