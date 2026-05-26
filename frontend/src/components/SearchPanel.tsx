import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Banknote, Maximize, Home, Zap } from 'lucide-react';

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
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-xl bg-surface border border-outline">
        <Icon className="w-4 h-4 text-brand-blue" />
      </div>
      <label htmlFor={id} className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
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
        className={`w-full p-5 bg-white border rounded-2xl focus:outline-none focus:ring-1 
                    text-on-surface font-display font-medium text-lg placeholder:text-slate-300
                    ${error ? 'border-brand-rose focus:ring-brand-rose' : 'border-outline focus:ring-brand-blue'}
                    transition-all duration-500 shadow-sm`}
      />
      {error && <p className="mt-2 text-[9px] font-bold text-brand-rose uppercase tracking-widest px-1">{error}</p>}
    </div>
  </div>
);

const CheckboxGroup: React.FC<{
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (value: string) => void;
  icon: React.ElementType;
}> = ({ label, options, selected, onChange, icon: Icon }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-6 px-1">
      <div className="p-2 rounded-xl bg-surface border border-outline">
        <Icon className="w-4 h-4 text-brand-blue" />
      </div>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </label>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`p-4 rounded-xl border text-[12px] font-bold transition-all duration-300 flex items-center justify-center gap-2
                    ${selected.includes(option.value) 
                      ? 'bg-brand-blue border-brand-blue text-white shadow-lg' 
                      : 'bg-white border-outline text-slate-600 hover:border-brand-blue hover:text-brand-blue'}`}
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
    { value: '1', label: '1 BHK' },
    { value: '2', label: '2 BHK' },
    { value: '3', label: '3 BHK' },
    { value: '4+', label: '4+ BHK' },
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
    <div className="bg-white rounded-3xl p-10 border border-outline shadow-elevated">
      <div className="mb-12">
        <h2 className="text-3xl font-display font-black text-on-surface tracking-tighter">Filter Properties</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] mt-3">Refine your search parameters</p>
      </div>

      <InputField
        label="Target Budget"
        id="budget"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder={'85,00,000'}
        error={budgetError}
        icon={Banknote}
      />

      <InputField
        label="Floor Area"
        id="area"
        type="number"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder={'1450'}
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
      {bhkError && <p className="mt-[-28px] mb-8 text-[9px] font-bold text-brand-rose uppercase tracking-widest px-1">{bhkError}</p>}

      <CheckboxGroup
        label="Select Perks"
        options={amenityOptions}
        selected={amenities}
        onChange={handleAmenitiesChange}
        icon={Zap}
      />

      {apiError && <p className="mb-8 text-[9px] font-bold text-brand-rose uppercase text-center">{apiError}</p>}

      <button
        onClick={handleProceed}
        className="group relative w-full bg-on-surface text-white h-20 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em]
                   hover:bg-brand-blue transition-all duration-700 overflow-hidden active:scale-[0.98] disabled:opacity-50"
        disabled={loading}
      >
        <span className={`flex items-center justify-center gap-4 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          Execute Analysis
          <div className="w-1.5 h-1.5 bg-brand-blue group-hover:bg-white rounded-full transition-colors duration-300"></div>
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
