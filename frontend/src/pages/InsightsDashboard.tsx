// frontend/src/pages/InsightsDashboard.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, ShieldCheck, BarChart3 } from 'lucide-react';
import { BestAreaSection } from '../components/BestAreaSection';
import { InvestmentSection } from '../components/InvestmentSection';
import { PriceAnalyzerSection } from '../components/PriceAnalyzerSection';
import { MetricInsights } from '../components/MetricInsights';
import { PredictionResult } from '../components/PredictionResult'; // Import new component

export const InsightsDashboard = () => {
  const navigate = useNavigate();
  const [activeResult, setActiveResult] = useState<React.ReactNode>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const handleResultUpdate = (type: 'investment' | 'price', res: React.ReactNode) => {
    // Wrap the tool-specific result component with the common PredictionResult styling
    setActiveResult(<PredictionResult type={type} data={res} />);
    setTimeout(() => {
        portalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-surface p-12 lg:p-20">
      <header className="max-w-[1400px] mx-auto mb-16 flex justify-between items-center">
        <div>
          <h1 className="text-6xl font-display font-black text-on-surface tracking-tighter">
            Insights <span className="text-brand-blue">Dashboard</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em] mt-4">Strategic Real Estate Intelligence</p>
        </div>
        <button 
            onClick={() => navigate('/')} 
            className="px-8 py-4 bg-on-surface text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-brand-blue transition-all duration-500"
        >
          <ArrowLeft size={16} className="inline mr-2" /> Back
        </button>
      </header>

      <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 items-start">
        {/* Full Width Scout */}
        <section className="col-span-12 bg-white p-12 rounded-3xl border border-outline shadow-sm">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-surface border border-outline rounded-2xl"><MapPin size={24} className="text-brand-blue" /></div>
                <h2 className="text-3xl font-display font-black tracking-tighter">Market Scout</h2>
            </div>
            <BestAreaSection />
        </section>
            
        {/* Half Width Analyzers (Side by Side) */}
        <section className="col-span-12 lg:col-span-6 bg-white p-10 rounded-3xl border border-outline shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-surface border border-outline rounded-2xl"><ShieldCheck size={24} className="text-brand-blue" /></div>
                <h2 className="text-2xl font-display font-black tracking-tighter">Investment Analysis</h2>
            </div>
            <InvestmentSection onResult={handleResultUpdate} />
        </section>
        
        <section className="col-span-12 lg:col-span-6 bg-white p-10 rounded-3xl border border-outline shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-surface border border-outline rounded-2xl"><BarChart3 size={24} className="text-brand-blue" /></div>
                <h2 className="text-2xl font-display font-black tracking-tighter">Price Valuation</h2>
            </div>
            <PriceAnalyzerSection onResult={handleResultUpdate} />
        </section>

        {/* Full Width Result Portal */}
        <section ref={portalRef} className="col-span-12 p-12">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-12">Live Diagnostic Results</h3>
            <AnimatePresence mode="wait">
                {activeResult ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        {activeResult}
                    </motion.div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-outline shadow-sm">
                        <p className="font-display font-black text-2xl text-on-surface">Analysis Pending</p>
                        <p className="text-[10px] uppercase tracking-[0.25em] mt-3">Select a tool to view detailed results</p>
                    </div>
                )}
            </AnimatePresence>
        </section>

        <section className="col-span-12">
            <MetricInsights />
        </section>
      </main>
    </motion.div>
  );
};
