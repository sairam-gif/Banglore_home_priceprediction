// frontend/src/App.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SearchPanel from './components/SearchPanel';
import TopStats from './components/TopStats';
import { LocationMap } from './LocationMap';
import { InsightsDashboard } from './pages/InsightsDashboard';
import axios from 'axios';

interface FilteredProperty {
  location_name: string;
  latitude: number;
  longitude: number;
  predicted_price: number;
  bhk: number;
  area_sqft: number;
  amenities: string[];
  recommendation_score: number;
}

function MainApp() {
  const [filteredProperties, setFilteredProperties] = useState<FilteredProperty[]>([]);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/locations');
        setAvailableLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  const defaultMapCenter: [number, number] = [12.9716, 77.5946];
  const defaultMapZoom: number = 11;

  const handleSearchSubmit = (data: FilteredProperty[]) => {
    setFilteredProperties(data);
    setVisibleCount(10);
    if (data.length > 0) {
      setSelectedLocationName(data[0].location_name);
    } else {
      setSelectedLocationName('');
    }
  };

  const mapReadyLocationData = useMemo(() => {
    return filteredProperties.map(prop => ({
      name: prop.location_name,
      lat: prop.latitude,
      lon: prop.longitude,
      avgPrice: prop.predicted_price,
      pricePerSqft: prop.predicted_price / prop.area_sqft,
      bhk: prop.bhk,
    }));
  }, [filteredProperties]);

  const handleRecommendationClick = (locationName: string) => {
    setSelectedLocationName(locationName);
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const stats = useMemo(() => {
    if (filteredProperties.length === 0) {
      return {
        averagePrice: 0,
        cheapestArea: { name: 'N/A', price: 0 },
        premiumArea: { name: 'N/A', price: 0 },
        bestROI: { name: 'N/A', score: 0 },
      };
    }
    const totalPrices = filteredProperties.reduce((sum, prop) => sum + prop.predicted_price, 0);
    const avgPrice = totalPrices / filteredProperties.length;
    const cheapest = filteredProperties.reduce((minProp, currentProp) =>
      currentProp.predicted_price < minProp.predicted_price ? currentProp : minProp
    );
    const premium = filteredProperties.reduce((maxProp, currentProp) =>
      currentProp.predicted_price > maxProp.predicted_price ? currentProp : maxProp
    );
    const bestRecommendation = filteredProperties.reduce((bestProp, currentProp) =>
      currentProp.recommendation_score > bestProp.recommendation_score ? currentProp : bestProp
    );
    return {
      averagePrice: Math.round(avgPrice),
      cheapestArea: { name: cheapest.location_name, price: Math.round(cheapest.predicted_price) },
      premiumArea: { name: premium.location_name, price: Math.round(premium.predicted_price) },
      bestROI: { name: bestRecommendation.location_name, score: bestRecommendation.recommendation_score },
    };
  }, [filteredProperties]);

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 bg-surface">
      <header className="max-w-[1400px] mx-auto mb-24 text-center animate-reveal-up">
        <h1 className="text-8xl font-display font-black text-on-surface mb-10 tracking-[-0.04em]">
          Bangalore <span className="text-brand-blue">Analytics</span>
        </h1>
        <p className="mt-12 text-slate-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">
          Predicting the future of urban living with data-driven precision and architectural insight.
        </p>
        <div className="mt-12">
            <button 
                onClick={() => navigate('/insights')}
                className="px-10 py-5 bg-on-surface text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-brand-blue transition-all duration-500"
            >
                Smart Insights Dashboard
            </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-16 items-start">
        <aside className="w-full lg:col-span-4 flex flex-col gap-12 sticky top-20 animate-reveal-up stagger-1">
          <SearchPanel onSearchSubmit={handleSearchSubmit} availableLocations={availableLocations} />
          <TopStats {...stats} />
        </aside>

        <div className="w-full lg:col-span-8 flex flex-col gap-16">
          <section className="animate-reveal-up stagger-2" ref={mapRef}>
            {loadingLocations ? (
              <div className="h-[600px] flex items-center justify-center bg-white rounded-3xl border border-outline shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em]">Initializing Data...</p>
                </div>
              </div>
            ) : (
              <div className="shadow-lg rounded-3xl overflow-hidden border border-outline">
                {mapReadyLocationData.length === 0 ? (
                  <div className="h-[600px] flex items-center justify-center bg-white">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-8 border border-outline">
                        <span className="text-5xl">🔍</span>
                      </div>
                      <p className="text-xl text-on-surface font-display font-black tracking-tighter">Ready to Explore</p>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-3">Start a search to generate insights</p>
                    </div>
                  </div>
                ) : (
                  <LocationMap
                    selectedLocationName={selectedLocationName}
                    locationData={mapReadyLocationData}
                    mapCenter={defaultMapCenter}
                    mapZoom={defaultMapZoom}
                  />
                )}
              </div>
            )}
          </section>

          {filteredProperties.length > 0 && (
            <section className="animate-reveal-up stagger-3">
              <div className="flex items-end justify-between mb-12 px-2">
                <div>
                  <h2 className="text-5xl font-display font-black text-on-surface tracking-tighter">Recommendations</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em] mt-4">Top value picks based on unique criteria.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matches</span>
                  <p className="text-5xl font-display font-black text-brand-blue tracking-tighter">{filteredProperties.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProperties.slice(0, visibleCount).map((prop, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl p-8 border border-outline shadow-sm hover:border-brand-blue hover:shadow-lg transition-all duration-700 cursor-pointer flex flex-col justify-between"
                    onClick={() => handleRecommendationClick(prop.location_name)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <h3 className="text-xl font-display font-black text-on-surface group-hover:text-brand-blue transition-colors duration-500">
                          {prop.location_name}
                        </h3>
                        <span className="bg-brand-emerald text-white text-[9px] font-black px-4 py-1.5 rounded-full tracking-[0.2em] uppercase">
                          ROI {Math.round(prop.recommendation_score)}
                        </span>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Projected Investment</span>
                          <p className="text-3xl font-display font-black text-on-surface mt-2">
                            ₹{(prop.predicted_price / 100000).toFixed(1)}L
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/insights" element={<InsightsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
