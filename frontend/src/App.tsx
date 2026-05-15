// frontend/src/App.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react'; // Added useRef
import SearchPanel from './components/SearchPanel';
import TopStats from './components/TopStats';
import { LocationMap } from './LocationMap';
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

function App() {
  const [filteredProperties, setFilteredProperties] = useState<FilteredProperty[]>([]);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true); // New loading state for initial fetch
  const [visibleCount, setVisibleCount] = useState<number>(10); // Initial visible count set to 10
  const mapRef = useRef<HTMLDivElement>(null); // Ref for map container

  // Fetch available locations from backend on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/locations');
        setAvailableLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoadingLocations(false); // Set loading to false after fetch attempt
      }
    };
    fetchLocations();
  }, []);

  // Default map center and zoom for Bangalore
  const defaultMapCenter: [number, number] = [12.9716, 77.5946];
  const defaultMapZoom: number = 11;

  // This function will be passed to SearchPanel to receive filtered data
  const handleSearchSubmit = (data: FilteredProperty[]) => {
    setFilteredProperties(data);
    setVisibleCount(10); // Reset visible count on new search
    if (data.length > 0) {
      setSelectedLocationName(data[0].location_name);
    } else {
      setSelectedLocationName('');
    }
  };

  // Transform filteredProperties for LocationMap consumption
  const mapReadyLocationData = useMemo(() => {
    return filteredProperties.map(prop => ({
      name: prop.location_name,
      lat: prop.latitude,
      lon: prop.longitude,
      avgPrice: prop.predicted_price,
      pricePerSqft: prop.predicted_price / prop.area_sqft,
      bhk: prop.bhk, // Pass BHK to map
    }));
  }, [filteredProperties]);

  // Handle recommendation click
  const handleRecommendationClick = (locationName: string) => {
    setSelectedLocationName(locationName);
    // Scroll to map
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // Calculate top stats from filteredProperties

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
        <div className="w-24 h-1.5 bg-brand-blue mx-auto rounded-full opacity-20"></div>
        <p className="mt-6 text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          Predicting the future of urban living with data-driven precision.
        </p>
      </header>

      <main className="max-w-8xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-10 items-start">
        {/* Sidebar: Search & Stats */}
        {/* <aside className="w-full lg:col-span-4 flex flex-col gap-10 sticky top-12 animate-reveal-up stagger-1">
          <SearchPanel onSearchSubmit={handleSearchSubmit} availableLocations={availableLocations} />
          <TopStats {...stats} />
        </aside> */}

        {/* <div className="w-24 h-1.5 bg-brand-blue mx-auto rounded-full opacity-20"></div>
        <p className="mt-6 text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          Predicting the future of urban living with data-driven precision.
        </p> */}
      </main>

      <main className="max-w-8xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-10 items-start">
        {/* Sidebar: Search & Stats */}
        <aside className="w-full lg:col-span-4 flex flex-col gap-10 sticky top-12 animate-reveal-up stagger-1">
          <SearchPanel onSearchSubmit={handleSearchSubmit} availableLocations={availableLocations} />
          <TopStats {...stats} />
        </aside>

        {/* Content: Map & Recommendations */}
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

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline/50">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configuration</span>
                            <p className="font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                              {prop.bhk === 1 ? '🏠' : prop.bhk === 2 ? '🏡' : prop.bhk === 3 ? '🏢' : '🏰'} {prop.bhk} BHK
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Size</span>
                            <p className="font-bold text-slate-700 mt-0.5">{prop.area_sqft.toLocaleString('en-IN')} <span className="text-slate-400 text-xs font-medium">sq.ft</span></p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Rate</span>
                          <span className="text-brand-blue font-black tracking-tight">
                            ₹{Math.round(prop.predicted_price / prop.area_sqft).toLocaleString('en-IN')}<span className="text-[10px] ml-0.5">/ft</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {prop.amenities.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {prop.amenities.slice(0, 4).map((amenity, idx) => (
                          <span key={idx} className="px-2 py-1 bg-surface text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider border border-outline">
                            {amenity}
                          </span>
                        ))}
                        {prop.amenities.length > 4 && (
                          <span className="px-2 py-1 text-slate-300 text-[9px] font-bold uppercase tracking-wider">
                            +{prop.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {visibleCount < filteredProperties.length && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleShowMore}
                    className="px-12 py-5 bg-on-surface text-white font-bold rounded-2xl 
                               shadow-elevated hover:bg-brand-blue transition-all duration-300 
                               transform hover:-translate-y-1 active:scale-95
                               cursor-pointer text-sm uppercase tracking-widest"
                  >
                    View More Analysis
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
