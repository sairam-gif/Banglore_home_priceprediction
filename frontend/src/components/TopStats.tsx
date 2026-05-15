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
  <div className={`bento-card p-6 shadow-hover-trigger flex flex-col justify-between h-full bg-white animate-reveal-up ${delayClass}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Market Metric</span>
    </div>

    <div>
      <h3 className="font-display text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-2xl font-black text-on-surface tracking-tight leading-none mb-2">
        {value}
      </p>
      <p className="text-slate-500 text-[11px] font-medium line-clamp-1">
        {subtext}
      </p>
    </div>
  </div>
);


const TopStats: React.FC<TopStatsProps> = ({ averagePrice, cheapestArea, premiumArea, bestROI }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <StatCard
        title="Avg. Market Price"
        value={`₹${(averagePrice / 100000).toFixed(1)}L`}
        subtext="Estimated city-wide baseline"
        icon={BarChart3}
        colorClass="bg-brand-blue"
        delayClass="stagger-1"
      />
      <StatCard
        title="Best Value Entry"
        value={cheapestArea.name}
        subtext={`Available from ₹${(cheapestArea.price / 100000).toFixed(1)}L`}
        icon={Coins}
        colorClass="bg-brand-emerald"
        delayClass="stagger-2"
      />
      <StatCard
        title="Premium District"
        value={premiumArea.name}
        subtext={`Peak valuations at ₹${(premiumArea.price / 10000000).toFixed(1)}Cr`}
        icon={Crown}
        colorClass="bg-brand-indigo"
        delayClass="stagger-3"
      />
      <StatCard
        title="Yield Potential"
        value={bestROI.name}
        subtext={`Score: ${Math.round(bestROI.score)} based on metrics`}
        icon={TrendingUp}
        colorClass="bg-brand-rose"
        delayClass="stagger-4"
      />
    </div>
  );
};

export default TopStats;
