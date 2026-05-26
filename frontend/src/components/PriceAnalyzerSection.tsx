// frontend/src/components/PriceAnalyzerSection.tsx

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

import {
  Activity,
  Sparkles,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const BANGALORE_LOCATIONS = [
  'Indiranagar',
  'HSR Layout',
  'Whitefield',
  'Jayanagar',
  'Koramangala',
  'Electronic City',
  'Sarjapur',
  'Bannerghatta',
  'Marathahalli',
  'Hebbal'
];

interface PriceAnalyzerSectionProps {
  onResult: (type: 'investment' | 'price', res: React.ReactNode) => void;
}

export const PriceAnalyzerSection = ({
  onResult
}: PriceAnalyzerSectionProps) => {
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
    let recommendation =
      'This property is priced competitively within the market range.';

    if (propertyRate < areaAvgRate * 0.85) {
      status = 'Undervalued';
      recommendation =
        'This property is priced attractively. Potential for high ROI.';
    } else if (propertyRate > areaAvgRate * 1.15) {
      status = 'Overpriced';
      recommendation =
        'This property is trading at a premium. Ensure unique amenities justify the cost.';
    }

    onResult('price',
      <>
        {/* STATUS CARD */}
        <div
          className={`p-10 rounded-3xl border flex flex-col justify-center shadow-sm ${
            status === 'Overpriced'
              ? 'bg-red-50 border-red-100'
              : 'bg-surface border-outline'
          }`}
        >
          <h3
            className={`text-6xl font-display font-black tracking-tighter ${
              status === 'Overpriced' ? 'text-red-600' : 'text-brand-emerald'
            }`}
          >
            {status}
          </h3>

          <p className="mt-8 text-on-surface text-lg font-medium">
            Market diagnostic for {location}
          </p>

          <div className="mt-12">
            {status === 'Overpriced' ? (
              <AlertCircle size={80} className="text-red-400" />
            ) : (
              <Sparkles size={80} className="text-brand-emerald" />
            )}
          </div>
        </div>

        {/* CHART CARD */}
        <div className="bg-white p-10 rounded-3xl border border-outline shadow-sm">
          <h4 className="flex items-center gap-3 font-display font-black text-on-surface mb-12 text-sm uppercase tracking-[0.2em]">
            <TrendingUp size={20} className="text-brand-blue" />
            Value Comparison
          </h4>

          <div className="h-64 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Property', val: propertyRate },
                  { name: 'Market', val: areaAvgRate }
                ]}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 'bold' }}
                />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff'}} />

                <Bar dataKey="val" radius={[0, 12, 12, 0]} barSize={40}>
                  <Cell
                    fill={
                      status === 'Overpriced' ? '#dc2626' : '#10b981'
                    }
                  />
                  <Cell fill="#cbd5e1" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-l-4 border-brand-blue pl-6 py-2">
            <p className="text-brand-blue font-black uppercase text-[10px] tracking-[0.2em] mb-2">Rationale</p>
            <p className="text-slate-500 text-sm leading-relaxed italic">
              {recommendation} The property is priced at <strong>₹{Math.round(propertyRate).toLocaleString()}/sqft</strong>, 
              {status === 'Overpriced' ? ' which is significantly higher' : status === 'Undervalued' ? ' which is significantly lower' : ' which is aligned'} 
              than the regional average of <strong>₹{areaAvgRate.toLocaleString()}/sqft</strong>.
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-4 border border-outline rounded-2xl bg-white"
      >
        {BANGALORE_LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (INR)"
        className="w-full p-4 border border-outline rounded-2xl"
      />

      <input
        type="number"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Area (sqft)"
        className="w-full p-4 border border-outline rounded-2xl"
      />

      <button
        onClick={analyze}
        className="w-full bg-brand-blue text-white py-4 rounded-2xl hover:bg-indigo-700 transition font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2"
      >
        <Activity size={18} />
        Run Diagnostic
      </button>
    </div>
  );
};
