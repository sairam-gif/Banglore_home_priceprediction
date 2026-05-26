// frontend/src/components/InvestmentSection.tsx
import { useState } from 'react';
import { Target, TrendingUp, BarChart3, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InvestmentFeedback } from './InvestmentFeedback';

const SCORE_COLORS: Record<string, string> = {
  'Excellent': 'bg-green-100 text-green-700 border-green-200',
  'Good': 'bg-blue-100 text-blue-700 border-blue-200',
  'Average': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Risky': 'bg-red-100 text-red-700 border-red-200'
};

export const InvestmentSection = ({ onResult }: { onResult: (type: 'investment' | 'price', res: React.ReactNode) => void }) => {
  const [priceSqft, setPriceSqft] = useState('');
  const [locScore, setLocScore] = useState('');
  const [analysis, setAnalysis] = useState<{score: number, label: string, comparison: any, factors: any} | null>(null);

  const analyze = () => {
    const p = parseFloat(priceSqft);
    const l = parseFloat(locScore);
    if (!p || !l) return;

    // Dynamic calculation logic (0-10 scale)
    const baseScore = Math.min(10, Math.max(0, (l) - (p / 2000)));
    const formattedScore = parseFloat(baseScore.toFixed(1));
    const label = formattedScore > 8 ? 'Excellent' : formattedScore > 6 ? 'Good' : formattedScore > 4 ? 'Average' : 'Risky';
    
    const data = { 
        score: formattedScore,
        label: label, 
        comparison: [
            { name: 'Market Avg', score: 6, color: '#94a3b8' },
            { name: 'Top Peer', score: 7.5, color: '#6366f1' },
            { name: 'Your Prop', score: formattedScore, color: formattedScore > 6 ? '#22c55e' : '#f59e0b' }
        ],
        factors: { Price: Math.round(p/1000), Location: l * 1, Amenities: 8 }
    };
    setAnalysis(data);

    // Send result to parent portal
    onResult('investment',
        <>
            <div className="space-y-12 flex-grow xl:col-span-2">
                <div className="bg-on-surface rounded-3xl border border-outline shadow-lg w-full">
                    <div className="p-12">
                        <div className="flex items-center gap-6">
                            <span className={`px-6 py-2 rounded-full text-[10px] font-black border uppercase tracking-[0.25em] ${SCORE_COLORS[data.label]}`}>
                                {data.label}
                            </span>
                            <span className="text-white text-xl font-black font-display">{formattedScore} <span className="text-slate-500 font-normal text-sm">/ 10</span></span>
                        </div>
                        <p className="mt-10 text-slate-200 leading-relaxed text-xl font-medium max-w-3xl">
                            Based on your inputs (Price: {p}, Score: {l}), your investment potential is {data.label.toLowerCase()}. 
                            This is driven by {formattedScore > 6 ? 'strong location and competitive pricing' : 'varying market factors'}.
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <div className="h-96 bg-white p-12 border border-outline rounded-3xl shadow-sm">
                        <h4 className="flex items-center gap-3 font-display font-black text-on-surface mb-12 text-sm uppercase tracking-[0.2em]">
                            <TrendingUp size={20} className="text-brand-blue"/> Performance Metrics
                        </h4>
                        <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={data.comparison} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" domain={[0, 10]} hide />
                            <YAxis dataKey="name" type="category" tick={{fill: '#64748b', fontSize: 14, fontWeight: 'bold'}} />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff'}} />
                            <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={50}>
                                {data.comparison.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-12 rounded-3xl border border-outline shadow-sm h-full">
                        <InvestmentFeedback score={data.score} factors={data.factors} />
                    </div>
                </div>
            </div>
        </>
    );
  };

  return (
    <div className="space-y-4">
        <input type="number" value={priceSqft} onChange={e => setPriceSqft(e.target.value)} placeholder="Price per Sqft" className="w-full p-4 border border-outline rounded-2xl" />
        <input type="number" value={locScore} onChange={e => setLocScore(e.target.value)} placeholder="Location Score (1-10)" className="w-full p-4 border border-outline rounded-2xl" />
        <button onClick={analyze} className="w-full bg-indigo-600 text-white py-4 rounded-2xl hover:bg-indigo-700 transition font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2">
            <Target size={18}/> Analyze Investment
        </button>
    </div>
  );
};
