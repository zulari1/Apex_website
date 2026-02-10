
import React from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../store/useSystemStore';

export const FinalCTA: React.FC = () => {
  const { handleInteraction } = useSystemStore();

  return (
    <section id="cta" className="py-32 relative overflow-hidden bg-dark-800">
      <div className="absolute inset-0 bg-glow-conic opacity-10 blur-[100px] animate-spin-slow"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-block bg-warning/10 text-warning border border-warning/20 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-pulse">
           🔥 7 slots remaining for this month's cohort
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          We Only Onboard 10 New Clients Per Month
        </h2>
        
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Our team personally configures every system. Limited capacity means we can't scale fast—but your results will be extraordinary.
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleInteraction('cta_clicked', { source: 'final_cta' })}
          className="bg-primary text-dark-900 text-lg font-bold px-12 py-5 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
          Book Your Strategy Call
        </motion.button>

        <p className="mt-6 text-sm text-gray-500">
          No credit card required. Just a conversation about scaling your revenue.
        </p>
      </div>
    </section>
  );
};
