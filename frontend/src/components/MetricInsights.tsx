// frontend/src/components/MetricInsights.tsx
import React from 'react';
import { HelpCircle, MapPin, Target, TrendingUp, ShieldCheck } from 'lucide-react';

export const MetricInsights = () => {
    return (
        <div className="bg-slate-950 text-slate-200 p-8 rounded-3xl mt-8">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <HelpCircle className="text-blue-400" /> How We Calculate Success
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <MapPin className="text-blue-400 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-white text-lg">Location Score (5x Weight)</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Evaluates connectivity, proximity to IT hubs, schools, and hospitals. High scores reflect "future-proof" areas with stable demand.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Target className="text-indigo-400 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-white text-lg">Investment Score</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                A composite of price competitiveness, amenity density, and resale liquidity. 
                                <span className="block mt-2 font-mono text-xs bg-slate-900 px-2 py-1 rounded inline-block text-indigo-300">
                                    30+ (Excellent) | 20-29 (Good) | 10-19 (Avg) | &lt;10 (Risky)
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-green-400"/> Why Trust Our Analytics?</h4>
                    <ul className="text-slate-400 text-sm space-y-3">
                        <li>✓ Data-driven location mapping.</li>
                        <li>✓ Market-adjusted pricing comparisons.</li>
                        <li>✓ Resale liquidity indexing.</li>
                        <li>✓ Future-oriented infrastructure growth tracking.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
