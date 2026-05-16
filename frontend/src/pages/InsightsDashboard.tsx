// frontend/src/pages/InsightsDashboard.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, ShieldCheck, BarChart3 } from 'lucide-react';
import { BestAreaSection } from '../components/BestAreaSection';
import { InvestmentSection } from '../components/InvestmentSection';
import { PriceAnalyzerSection } from '../components/PriceAnalyzerSection';
import { MetricInsights } from '../components/MetricInsights';

export const InsightsDashboard = () => {
  const navigate = useNavigate();
  const [activeResult, setActiveResult] = useState<React.ReactNode>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const handleResultUpdate = (res: React.ReactNode) => {
    setActiveResult(res);
    // Delay scroll slightly to allow React to render the new content
    setTimeout(() => {
        portalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Analytics Hub</h1>
          <p className="text-slate-500 font-medium text-sm">Strategic Real Estate Intelligence</p>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all font-semibold text-sm">
          <ArrowLeft size={16} /> Dashboard Home
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-10">
        <section className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={24} /></div>
                 <h2 className="text-3xl font-extrabold tracking-tight">Market Scout</h2>
               </div>
               <BestAreaSection />
            </div>
            
            <div className="flex flex-col gap-8">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex-1">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><ShieldCheck size={24} /></div>
                     <h2 className="text-3xl font-extrabold tracking-tight">Investment Score</h2>
                   </div>
                   <InvestmentSection onResult={handleResultUpdate} />
                </div>
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex-1">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl"><BarChart3 size={24} /></div>
                     <h2 className="text-3xl font-extrabold tracking-tight">Price Analyzer</h2>
                     </div>
                   <PriceAnalyzerSection onResult={handleResultUpdate} />
                </div>
            </div>
        </section>

        {/* Centralized Result Portal */}
        <section ref={portalRef} className="w-full min-h-[400px] bg-slate-950 rounded-3xl p-10 text-white shadow-2xl transition-all duration-500">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-400 uppercase tracking-widest text-sm">
                Live Diagnostic Results
            </h3>
            <AnimatePresence mode="wait">
                {activeResult ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        {activeResult}
                    </motion.div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-600">
                        <p className="font-bold text-xl">Select a tool to begin your diagnostic</p>
                        <p className="text-sm">Real-time analysis results will appear here</p>
                    </div>
                )}
            </AnimatePresence>
        </section>

        <MetricInsights />
      </main>
    </motion.div>
  );
};
