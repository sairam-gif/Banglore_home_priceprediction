// frontend/src/components/BestAreaSection.tsx
import { useState } from 'react';
import { Search, TrendingUp, LayoutGrid } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { generatePropertyRationale } from '../utils/rationaleGenerator';

const LOCATIONS = [
    { name: 'Indiranagar', basePrice: 250, amenities: ['Gym', 'Pool'], nearby: ['Metro', '100ft Road'] },
    { name: 'HSR Layout', basePrice: 180, amenities: ['Club', 'Security'], nearby: ['Agara Lake', 'Silk Board'] },
    { name: 'Whitefield', basePrice: 150, amenities: ['Park', 'Security'], nearby: ['ITPL', 'Phoenix MarketCity'] },
    { name: 'Jayanagar', basePrice: 200, amenities: ['Park', 'Gym'], nearby: ['Metro', 'Central Mall'] },
    { name: 'Koramangala', basePrice: 220, amenities: ['Pool', 'Club'], nearby: ['Forum Mall', 'Sony Signal'] }
];

export const BestAreaSection = () => {
  const [results, setResults] = useState([]);
  const [budget, setBudget] = useState('');
  const [bhk, setBhk] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic: filter by budget (simple approximation)
    const filtered = LOCATIONS
        .filter(loc => loc.basePrice <= (parseInt(budget) || 1000))
        .sort(() => 0.5 - Math.random()) // Randomize
        .slice(0, 2)
        .map(loc => ({
            Location: loc.name,
            score: (Math.random() * 2 + 7).toFixed(1),
            comparison_score: Math.floor(Math.random() * 40 + 50),
            type: 'Top Recommendation',
            avg_price: loc.basePrice * 100000,
            amenities: loc.amenities,
            nearby: loc.nearby,
            factors: { Price: Math.floor(Math.random() * 9) + 1, Location: 9, Amenities: 9 }
        }));

    setResults(filtered as any);
  };

  const alternatives = [
    { bhk: '2 BHK', location: 'Electronic City', price: '₹0.8Cr' },
    { bhk: '3 BHK', location: 'Sarjapur', price: '₹1.5Cr' },
    { bhk: '4 BHK', location: 'Bannerghatta', price: '₹2.8Cr' }
  ];

  return (
    <div className="space-y-12">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-900 rounded-3xl">
        <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget (in Lakhs)" className="p-3 border rounded-xl bg-slate-800 text-white placeholder-slate-400" />
        <input type="number" value={bhk} onChange={(e) => setBhk(e.target.value)} placeholder="BHK" className="p-3 border rounded-xl bg-slate-800 text-white placeholder-slate-400" />
        <button type="submit" className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 transition flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm">
          <Search size={18} /> Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-black text-2xl mb-8 text-slate-900 flex items-center gap-3">
                <TrendingUp className="text-blue-600" /> Comparative Market Performance
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="Location" />
                    <YAxis />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Legend />
                    <Bar dataKey="comparison_score" name="Performance Index" fill="#3b82f6" radius={[8,8,0,0]} />
                    <ReferenceLine y={70} label="Market Threshold" stroke="red" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl">
            <h3 className="font-black text-2xl mb-6">Strategic Rationale</h3>
            <div className="grid md:grid-cols-2 gap-8">
                {results.map((area: any) => {
                    const rationale = generatePropertyRationale(area);
                    return (
                        <div key={area.Location} className="border-l-4 border-blue-500 pl-6">
                            <h4 className="text-xl font-bold mb-2 text-blue-400">{rationale.title}</h4>
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">{rationale.narrative}</p>
                            <div className="flex gap-2">
                                {Object.entries(rationale.scoreBreakdown).map(([k, v]: any) => (
                                    <span key={k} className="text-[10px] font-black uppercase bg-slate-800 px-2 py-1 rounded-md text-blue-400">
                                        {k}: {v}/10
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 pt-12 border-t border-slate-800">
                <h3 className="font-black text-2xl mb-8 flex items-center gap-3 text-white">
                    <LayoutGrid className="text-blue-400" /> Alternative Configuration Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {alternatives.map((alt) => (
                        <div key={alt.location} className="bg-slate-800 p-6 rounded-2xl hover:bg-slate-700 transition">
                            <div className="text-blue-400 font-black text-sm uppercase tracking-widest">{alt.bhk}</div>
                            <div className="text-xl font-bold my-2">{alt.location}</div>
                            <div className="text-slate-400 font-medium">{alt.price}</div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
