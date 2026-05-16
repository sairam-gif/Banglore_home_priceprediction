// frontend/src/components/InvestmentFeedback.tsx
import React from 'react';
import { Award, Zap, ArrowUpCircle } from 'lucide-react';

export const InvestmentFeedback = ({ score, factors }: { score: number, factors: any }) => {
    // Determine primary strength and weakness
    const strength = Object.keys(factors).reduce((a, b) => factors[a] > factors[b] ? a : b);
    const weakness = Object.keys(factors).reduce((a, b) => factors[a] < factors[b] ? a : b);

    const getAdvice = (weakFactor: string) => {
        const advice: any = {
            Price: "Consider negotiating the acquisition price or focusing on areas with lower entry costs to improve your price-per-sqft parity.",
            Location: "The current location metrics are moderate; consider properties closer to transit corridors or upcoming commercial hubs to boost future appreciation.",
            Amenities: "Upgrading internal amenities (e.g., smart home features, club membership) can significantly increase tenant demand and resale velocity."
        };
        return advice[weakFactor] || "Maintain current property management standards to ensure long-term stability.";
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-2xl mt-8">
            <div className="flex items-center gap-4 mb-8">
                <Award className="text-yellow-400" size={32} />
                <h3 className="text-2xl font-black">AI Investment Coaching</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-indigo-950/50 p-6 rounded-2xl border border-indigo-800">
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider">Your AI Score</p>
                    <div className="text-5xl font-black mt-2">{score}/10</div>
                </div>
                <div className="bg-indigo-950/50 p-6 rounded-2xl border border-indigo-800">
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider">Primary Strength</p>
                    <div className="text-xl font-bold mt-2 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400"/> {strength}
                    </div>
                </div>
                <div className="bg-indigo-950/50 p-6 rounded-2xl border border-indigo-800">
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider">Growth Opportunity</p>
                    <div className="text-xl font-bold mt-2 flex items-center gap-2">
                        <ArrowUpCircle size={18} className="text-green-400"/> {weakness}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-indigo-800">
                <h4 className="font-bold mb-3">Action Plan for {weakness}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{getAdvice(weakness)}</p>
            </div>
        </div>
    );
};
