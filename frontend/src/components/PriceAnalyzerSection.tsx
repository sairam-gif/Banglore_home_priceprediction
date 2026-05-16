// frontend/src/components/PriceAnalyzerSection.tsx
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, ArrowRightCircle, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';

const BANGALORE_LOCATIONS = [
    'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Koramangala',
    'Electronic City', 'Sarjapur', 'Bannerghatta', 'Marathahalli', 'Hebbal'
];

export const PriceAnalyzerSection = ({ onResult }: { onResult: (res: React.ReactNode) => void }) => {
  const [location, setLocation] = useState(BANGALORE_LOCATIONS[0]);
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');

  const analyze = () => {
    const p = parseFloat(price);
    const a = parseFloat(area);
    if (!p || !a || a <= 0) return;

    const propertyRate = p / a;
    const areaAvgRate = 5000;
    
    let status = 'Fairly Priced';
    let recommendation = 'This property is priced competitively within the market range.';

    if (propertyRate < areaAvgRate * 0.85) {
        status = 'Undervalued';
        recommendation = 'This property is priced attractively. Potential for high ROI.';
    } else if (propertyRate > areaAvgRate * 1.15) {
        status = 'Overpriced';
        recommendation = `This property is trading at a premium. Ensure unique amenities justify the cost, or consider locations like Whitefield.`;
    }

    onResult(
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className={`p-8 rounded-3xl border border-slate-700 flex flex-col justify-center ${status === 'Overpriced' ? 'bg-red-950' : 'bg-green-950'}`}>
                <h3 className={`text-5xl font-black ${status === 'Overpriced' ? 'text-red-400' : 'text-green-400'}`}>{status}</h3>
                <p className="mt-4 text-slate-300 font-medium">Market diagnostic for {location}</p>
                {status === 'Overpriced' ? <AlertCircle size={64} className="text-red-500 mt-6"/> : <Sparkles size={64} className="text-green-500 mt-6"/>}
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700">
                <h4 className="flex items-center gap-2 font-black text-white mb-8"><TrendingUp size={20} className="text-teal-400"/> Value Comparison</h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{name: 'Property', val: propertyRate}, {name: 'Market', val: areaAvgRate}]} layout="vertical" margin={{left: 20}}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b'}} />
                            <Bar dataKey="val" radius={[0, 8, 8, 0]} barSize={40}>
                                <Cell fill={status === 'Overpriced' ? '#ef4444' : '#22c55e'} />
                                <Cell fill="#64748b" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-slate-400 text-sm mt-6 leading-relaxed italic border-l-4 border-teal-500 pl-4">
                    {recommendation}
                </p>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-4">
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
          {BANGALORE_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (INR)" className="w-full p-3 border rounded-xl" />
        <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area (sqft)" className="w-full p-3 border rounded-xl" />
        <button onClick={analyze} className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <Activity size={18} /> Run Diagnostic
        </button>
    </div>
  );
};
