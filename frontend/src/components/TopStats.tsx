import React from 'react';
import { TrendingUp, Coins, Crown, BarChart3 } from 'lucide-react';

interface TopStatsProps {
  averagePrice: number;
  cheapestArea: { name: string; price: number };
  premiumArea: { name: string; price: number };
  bestROI: { name: string; score: number };
}

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  colorClass: string;
  delayClass: string;
}

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, delayClass }: any) => (
  <div className={`bg-white p-8 rounded-3xl border border-outline shadow-sm hover:shadow-lg transition-all duration-700 animate-reveal-up ${delayClass}`}>
    <div className="flex items-center justify-between mb-8">
      <div className="p-3 rounded-2xl bg-surface border border-outline">
        <Icon className="w-5 h-5 text-brand-blue" />
      </div>
      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.25em]">{title}</span>
    </div>

    <div>
      <p className="text-4xl font-display font-black text-on-surface tracking-tighter mb-3">
        {value}
      </p>
      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">
        {subtext}
      </p>
    </div>
  </div>
);


const TopStats: React.FC<TopStatsProps> = ({ averagePrice, cheapestArea, premiumArea, bestROI }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <StatCard
        title="Avg. Market Price"
        value={`₹${(averagePrice / 100000).toFixed(1)}L`}
        subtext="Estimated city-wide baseline"
        icon={BarChart3}
        colorClass="text-brand-blue"
        delayClass="stagger-1"
      />
      <StatCard
        title="Best Value Entry"
        value={cheapestArea.name}
        subtext={`Available from ₹${(cheapestArea.price / 100000).toFixed(1)}L`}
        icon={Coins}
        colorClass="text-brand-emerald"
        delayClass="stagger-2"
      />
      <StatCard
        title="Premium District"
        value={premiumArea.name}
        subtext={`Peak valuations at ₹${(premiumArea.price / 10000000).toFixed(1)}Cr`}
        icon={Crown}
        colorClass="text-brand-indigo"
        delayClass="stagger-3"
      />
      <StatCard
        title="Yield Potential"
        value={bestROI.name}
        subtext={`Score: ${Math.round(bestROI.score)} / 100`}
        icon={TrendingUp}
        colorClass="text-brand-rose"
        delayClass="stagger-4"
      />
    </div>
  );
};

export default TopStats;
