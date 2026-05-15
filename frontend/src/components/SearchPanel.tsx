import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Banknote, Maximize, Home, Zap } from 'lucide-react';

// Reusable Input Component (Redesigned)
const InputField: React.FC<{
  label: string;
  id: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  icon: React.ElementType;
}> = ({ label, id, type, value, onChange, placeholder, error, icon: Icon }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <label htmlFor={id} className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </label>
    </div>
    <div className="relative group">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 
                    text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium
                    ${error ? 'border-brand-rose focus:ring-brand-rose/20' : 'border-slate-100 focus:ring-brand-blue/20'}
                    transition-all duration-300 group-hover:bg-white group-hover:border-slate-200`}
      />
      {error && <p className="mt-2 text-[10px] font-bold text-brand-rose uppercase tracking-wide px-1">{error}</p>}
    </div>
  </div>
);

// Reusable Checkbox Group Component (Redesigned)
const CheckboxGroup: React.FC<{
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (value: string) => void;
  icon: React.ElementType;
}> = ({ label, options, selected, onChange, icon: Icon }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4 px-1">
      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </label>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`p-3 rounded-xl border text-[13px] font-bold transition-all duration-300 flex items-center justify-center gap-2
                    ${selected.includes(option.value) 
                      ? 'bg-brand-blue border-brand-blue text-white shadow-elevated scale-[1.02]' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

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

interface SearchPanelProps {
  onSearchSubmit: (data: FilteredProperty[]) => void;
  availableLocations: string[];
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearchSubmit }) => {
  const [budget, setBudget] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [bhk, setBhk] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const [budgetError, setBudgetError] = useState<string>('');
  const [areaError, setAreaError] = useState<string>('');
  const [bhkError, setBhkError] = useState<string>('');

  const bhkOptions = [
    { value: '1', label: '🏠 1 BHK' },
    { value: '2', label: '🏡 2 BHK' },
    { value: '3', label: '🏢 3 BHK' },
    { value: '4+', label: '🏰 4+ BHK' },
  ];

  const amenityOptions = [
    { value: 'Gymnasium', label: 'Gym' },
    { value: 'SwimmingPool', label: 'Pool' },
    { value: 'LiftAvailable', label: 'Lift' },
    { value: 'ClubHouse', label: 'Club' },
    { value: 'CarParking', label: 'Parking' },
    { value: '24X7Security', label: '24/7' },
    { value: 'PowerBackup', label: 'Backup' },
    { value: 'Wifi', label: 'Wi-Fi' },
  ];

  const handleBhkChange = (value: string) => {
    setBhk((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value].sort()
    );
    setBhkError('');
  };

  const handleAmenitiesChange = (value: string) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value].sort()
    );
  };

  const validateForm = () => {
    let isValid = true;
    setBudgetError('');
    setAreaError('');
    setBhkError('');
    setApiError('');

    const parsedBudget = parseFloat(budget);
    const parsedArea = parseFloat(area);

    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      setBudgetError('Budget required');
      isValid = false;
    }
    if (isNaN(parsedArea) || parsedArea <= 0) {
      setAreaError('Area required');
      isValid = false;
    }
    if (bhk.length === 0) {
      setBhkError('Select BHK');
      isValid = false;
    }

    return isValid;
  };

  const handleProceed = async () => {
    if (validateForm()) {
      setLoading(true);
      setApiError('');
      try {
        const payload = {
          max_budget: parseFloat(budget),
          bhk_types: bhk,
          area_sqft: parseFloat(area),
          amenities: amenities,
        };
        const response = await axios.post('http://localhost:8000/api/filter_properties', payload);
        onSearchSubmit(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setApiError(error.response?.data?.detail || 'Fetch failed');
        } else {
          setApiError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Market Filter</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Refine your search parameters</p>
      </div>

      <InputField
        label="Target Budget"
        id="budget"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder={'e.g., 85,00,000'}
        error={budgetError}
        icon={Banknote}
      />

      <InputField
        label="Floor Area"
        id="area"
        type="number"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder={'e.g., 1450'}
        error={areaError}
        icon={Maximize}
      />

      <CheckboxGroup
        label="Property Units"
        options={bhkOptions}
        selected={bhk}
        onChange={handleBhkChange}
        icon={Home}
      />
      {bhkError && <p className="mt-[-20px] mb-6 text-[10px] font-bold text-brand-rose uppercase px-1">{bhkError}</p>}

      <CheckboxGroup
        label="Select Perks"
        options={amenityOptions}
        selected={amenities}
        onChange={handleAmenitiesChange}
        icon={Zap}
      />

      {apiError && <p className="mb-6 text-[10px] font-bold text-brand-rose uppercase text-center">{apiError}</p>}

      <button
        onClick={handleProceed}
        className="group relative w-full bg-slate-900 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest
                   hover:bg-brand-blue transition-all duration-500 overflow-hidden active:scale-95 disabled:opacity-50"
        disabled={loading}
      >
        <span className={`flex items-center justify-center gap-3 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          Execute Analysis
          <div className="w-1.5 h-1.5 bg-brand-blue group-hover:bg-white rounded-full"></div>
        </span>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        )}
      </button>
    </div>
  );
};

export default SearchPanel;
