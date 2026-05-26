import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, ShieldCheck, Banknote } from 'lucide-react';

const Card = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-8 rounded-3xl border border-outline shadow-sm ${className}`}>
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6">{title}</h3>
    {children}
  </div>
);

export const PredictionResult = ({ type, data }: { type: 'investment' | 'price', data: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-[1200px] mx-auto p-4 md:p-8"
    >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
            {data}
        </div>
    </motion.div>
  );
};
