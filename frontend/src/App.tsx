// frontend/src/App.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SearchPanel from './components/SearchPanel';
import TopStats from './components/TopStats';
import { LocationMap } from './LocationMap';
import { InsightsDashboard } from './pages/InsightsDashboard';
import axios from 'axios';

// Define a type for the filtered property data received from the backend
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

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10);
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
    <div className="min-h-screen p-4 md:p-8 lg:p-12 animate-fade-in">
      <header className="max-w-7xl mx-auto mb-16 text-center animate-reveal-up">
        <h1 className="text-5xl md:text-6xl font-black font-display text-on-surface mb-4 tracking-tighter">
          Bangalore <span className="text-brand-blue">Real Estate</span> Analytics
        </h1>
        <div className="flex gap-4 justify-center mb-6">
            <button 
                onClick={() => navigate('/insights')}
                className="px-6 py-3 bg-brand-blue text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
                Smart Insights Dashboard
            </button>
        </div>
        <div className="w-24 h-1.5 bg-brand-blue mx-auto rounded-full opacity-20"></div>
        <p className="mt-6 text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          Predicting the future of urban living with data-driven precision.
        </p>
      </header>

      <main className="max-w-8xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-10 items-start">
        <aside className="w-full lg:col-span-4 flex flex-col gap-10 sticky top-12 animate-reveal-up stagger-1">
          <SearchPanel onSearchSubmit={handleSearchSubmit} availableLocations={availableLocations} />
          <TopStats {...stats} />
        </aside>

        <div className="w-full lg:col-span-8 flex flex-col gap-10">
          <section className="animate-reveal-up stagger-2" ref={mapRef}>
            {loadingLocations ? (
              <div className="h-[500px] flex items-center justify-center glass rounded-3xl border border-white/50 shadow-elevated">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-500 font-semibold">Initializing Market Data...</p>
                </div>
              </div>
            ) : (
              <div className="shadow-elevated rounded-3xl overflow-hidden border border-white/50">
                {mapReadyLocationData.length === 0 ? (
                  <div className="h-[600px] flex items-center justify-center bg-slate-50/50">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🔍</span>
                      </div>
                      <p className="text-xl text-slate-400 font-medium">Start a search to explore property zones.</p>
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
              <div className="flex items-end justify-between mb-8 px-2">
                <div>
                  <h2 className="text-4xl font-bold text-on-surface tracking-tight">Smart Recommendations</h2>
                  <p className="text-slate-500 mt-2 font-medium">Top value picks based on your unique criteria.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Results found</span>
                  <p className="text-2xl font-black text-brand-blue">{filteredProperties.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.slice(0, visibleCount).map((prop, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-6 border border-outline shadow-soft 
                               shadow-hover-trigger cursor-pointer flex flex-col justify-between
                               hover:border-brand-blue/30 transition-all duration-300"
                    onClick={() => handleRecommendationClick(prop.location_name)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-on-surface group-hover:text-brand-blue transition-colors">
                          {prop.location_name}
                        </h3>
                        <span className="bg-brand-emerald/10 text-brand-emerald text-[10px] font-black px-2 py-1 rounded-md border border-brand-emerald/20">
                          ROI SCORE: {Math.round(prop.recommendation_score)}
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projected Investment</span>
                          <p className="text-2xl font-black text-on-surface">
                            ₹{prop.predicted_price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
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
