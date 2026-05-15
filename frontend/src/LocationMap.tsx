// frontend/src/LocationMap.tsx

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css'; // Import MarkerCluster CSS
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'; // Import Default MarkerCluster CSS
import MarkerClusterGroup from 'react-leaflet-cluster'; // Import MarkerClusterGroup

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define custom default icon
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// BHK specific icons (using emojis in divIcon)
const getBhkIcon = (bhk: number) => {
  const emoji = bhk === 1 ? '🏠' : bhk === 2 ? '🏡' : bhk === 3 ? '🏢' : '🏰';
  
  return L.divIcon({
    html: `<div style="
      font-size: 20px; 
      background: white; 
      border-radius: 50%; 
      width: 36px; 
      height: 36px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 3px 6px rgba(0,0,0,0.3); 
      border: 2px solid #2563eb;
      transform: translateY(-5px);
    ">${emoji}</div>`,
    className: 'custom-bhk-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Set default icon for all Leaflet markers
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to smoothly center map and set zoom
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      animate: true,
      duration: 1.5, // Smooth animation duration
    });
  }, [center, zoom, map]);
  return null;
}

// Data structure for location items (assuming avgPrice and pricePerSqft might be present)
interface LocationDataItem {
  name: string;
  lat: number;
  lon: number;
  avgPrice?: number;
  pricePerSqft?: number;
  bhk?: number; // BHK is now passed
  // Add other relevant property details if available from the API response
  price?: number;
  area?: number;
  bedrooms?: number;
  amenities?: string[];
}

interface LocationMapProps {
  selectedLocationName: string;
  locationData: LocationDataItem[];
  mapCenter: [number, number];
  mapZoom: number;
}

export function LocationMap({ selectedLocationName, locationData, mapCenter, mapZoom }: LocationMapProps) {
  // Find the selected location from locationData to get its coordinates
  const selectedLocation = locationData.find(loc => loc.name === selectedLocationName);

  // If a location is selected, use its coordinates as the effective center, 
  // otherwise fallback to the default mapCenter.
  const effectiveMapCenter: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lon] 
    : mapCenter;

  // Zoom in a bit more if a specific location is selected
  const effectiveZoom: number = selectedLocation ? 14 : mapZoom;

  if (!locationData || locationData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-[24px] border border-gray-200">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No properties found matching your criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      <div className="absolute top-4 left-4 z-[1000] glass px-4 py-2 rounded-xl border border-white/50 shadow-soft pointer-events-none group-hover:opacity-100 transition-opacity opacity-80">
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
          </span>
          Live Market Overlay
        </p>
      </div>
      <MapContainer
        center={effectiveMapCenter}
        zoom={effectiveZoom}
        scrollWheelZoom={true}
        className="h-[600px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={effectiveMapCenter} zoom={effectiveZoom} />

        {/* Render a red circle for the selected location */}
        {selectedLocation && (
          <Circle
            center={[selectedLocation.lat, selectedLocation.lon]}
            radius={500} // 500 meters radius
            pathOptions={{
              color: 'red',
              fillColor: 'red',
              fillOpacity: 0.2,
              weight: 2
            }}
          />
        )}

        {/* Cluster for all properties */}
        <MarkerClusterGroup chunkedLoading>
          {locationData.map((loc, idx) => (
            <Marker 
              key={idx} 
              position={[loc.lat, loc.lon]} 
              icon={getBhkIcon(loc.bhk || 0)}
            >
              <Popup>
                <div className="font-semibold text-center">
                  <p className="text-gray-800 text-lg">{loc.name || 'Property'}</p>
                  {loc.avgPrice !== undefined && ( // Use avgPrice for filtered results
                    <p>Price: ₹{loc.avgPrice.toLocaleString('en-IN')}</p>
                  )}
                  {loc.bhk !== undefined && ( // Use bhk for filtered results
                    <p>{loc.bhk === 1 ? '🏠' : loc.bhk === 2 ? '🏡' : loc.bhk === 3 ? '🏢' : '🏰'} BHK: {loc.bhk}</p>
                  )}
                  {loc.pricePerSqft !== undefined && ( // Display price per sqft if available
                    <p>Price/Sqft: ₹{loc.pricePerSqft.toLocaleString('en-IN')}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
