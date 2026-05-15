# Bangalore House Price Prediction System

## Project Overview
AI-powered real estate platform for Bangalore property analytics, prediction, and smart recommendation.

## Main Goal
Build an intelligent real-estate system that allows users to:

- predict house prices
- analyze investment value
- compare areas
- explore property insights
- make data-driven buying decisions

---

## Dataset Features

Main columns:

- Price
- Area
- Location
- No. of Bedrooms
- Resale
- Gymnasium
- SwimmingPool
- LiftAvailable
- ClubHouse
- CarParking
- 24X7Security
- PowerBackup
- School
- Hospital
- ATM
- Wifi
- GolfCourse
- VaastuCompliant
- Children'splayarea
- SportsFacility

---

## Feature Engineering

Generate derived features:

- PricePerSqft
- AmenitiesScore
- LocationScore
- InvestmentScore

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts
- React Leaflet

### Backend
- Flask
- Python
- scikit-learn
- pandas
- xgboost

### Database
- MongoDB

---

## Existing Features

### 1. Price Prediction
Inputs:
- location
- area
- bedrooms
- amenities
- resale

### 2. Dashboard
- bar charts
- pie charts
- area analysis
- comparisons

### 3. Map
- heatmap
- markers
- price zones

---

## New Module

Create separate page:

## Smart Property Insights Dashboard

New page only.

Do not disturb existing prediction page.

---

## New Features

### 1. Best Area Suggestion
Input:
- budget
- bedrooms
- amenities

Output:
- top areas
- score
- avg price
- avg size

### 2. Investment Score
Analyze:
- price per sqft
- resale
- amenities
- locality

Output:
- Excellent
- Good
- Average
- Risky

### 3. Price Per Sqft Analyzer
Analyze:
- price / area
- compare area avg
- classify value

Output:
- undervalued
- fair
- overpriced

---

## APIs

Existing:

- /predict
- /locations
- /map-data
- /analytics
- /recommendations

New:

- /best-area
- /investment-score
- /price-per-sqft

---

## UI Requirements

Create separate analytics page.

Must include:

- modern dashboard
- responsive cards
- filters
- results
- transitions
- page navigation
- back button

---

## Folder Structure

project-root/

backend/
frontend/
docs/
README.md
gemini.md

Maintain existing architecture.