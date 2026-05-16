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

export const InvestmentSection = ({ onResult }: { onResult: (res: React.ReactNode) => void }) => {
  const [analysis, setAnalysis] = useState<{score: number, label: string, comparison: any, factors: any} | null>(null);

  const analyze = () => {
    const data = { 
        score: 8.5,
        label: 'Excellent', 
        comparison: [
            { name: 'Market Avg', score: 65, color: '#94a3b8' },
            { name: 'Top Peer', score: 80, color: '#6366f1' },
            { name: 'Your Prop', score: 85, color: '#22c55e' }
        ],
        factors: { Price: 7, Location: 9, Amenities: 8 }
    };
    setAnalysis(data);

    // Send result to parent portal
    onResult(
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase ${SCORE_COLORS[data.label]}`}>
                        {data.label}
                    </span>
                    <p className="mt-4 text-slate-300 leading-relaxed text-sm">
                        Your investment potential is significantly higher than the market average.
                    </p>
                </div>
                <div className="h-56 bg-slate-900 p-8 border border-slate-700 rounded-2xl">
                    <h4 className="flex items-center gap-2 font-black text-white mb-4 text-sm">
                        <TrendingUp size={16} className="text-indigo-400"/> Performance Benchmarking
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.comparison} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                        <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={32}>
                            {data.comparison.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <InvestmentFeedback score={data.score} factors={data.factors} />
        </div>
    );
  };

  return (
    <div className="space-y-4">
        <input type="number" placeholder="Price per Sqft" className="w-full p-3 border rounded-xl" />
        <input type="number" placeholder="Location Score (1-10)" className="w-full p-3 border rounded-xl" />
        <button onClick={analyze} className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2">
            <Target size={18}/> Analyze Investment
        </button>
    </div>
  );
};
