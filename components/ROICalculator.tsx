import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowRight } from 'lucide-react';

export const ROICalculator: React.FC = () => {
  const [sdrCount, setSdrCount] = useState(3);
  const [manualHours, setManualHours] = useState(30);

  // Assumptions
  const COST_PER_SDR = 70000;
  const APEX_COST_ANNUAL = 5997 * 12; // Using Tier 2 pricing for comparison (~72k)

  const annualCostSDR = sdrCount * COST_PER_SDR;
  // If they have > 1 SDR, the comparison is starker. Apex replaces the TEAM.
  // We'll assume Apex cost is flat (Tier 2 can handle ~5k leads/mo which is multiple SDRs work)
  const annualCostApex = APEX_COST_ANNUAL; 
  
  const savings = annualCostSDR - annualCostApex;
  const roi = Math.round(((savings / annualCostApex) * 100));

  return (
    <section id="roi" className="py-24 bg-dark-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Calculate What You're Losing
          </h2>
          <p className="text-gray-400">See the math behind replacing human effort with AI infrastructure.</p>
        </div>

        <div className="bg-dark-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Controls */}
            <div className="space-y-10">
              <div>
                <label className="flex justify-between text-gray-300 font-medium mb-4">
                  <span>Number of SDRs</span>
                  <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded">{sdrCount}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={sdrCount} 
                  onChange={(e) => setSdrCount(Number(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-gray-500 mt-2">Avg cost per SDR: $70k/yr (Salary + Overhead)</p>
              </div>

              <div>
                <label className="flex justify-between text-gray-300 font-medium mb-4">
                  <span>Hours/week on manual tasks</span>
                  <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded">{manualHours}</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  value={manualHours} 
                  onChange={(e) => setManualHours(Number(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-white/5 rounded-2xl p-8 flex flex-col justify-center border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <DollarSign size={100} />
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-gray-400">Cost with Humans</span>
                    <span className="text-xl font-mono text-white">${annualCostSDR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-gray-400">Cost with Revenue OS</span>
                    <span className="text-xl font-mono text-primary">${annualCostApex.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-2">
                    <span className="text-sm text-gray-400 block mb-1">Projected Annual Savings</span>
                    <motion.div 
                      key={savings}
                      initial={{ scale: 0.9, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl md:text-5xl font-bold text-success font-mono tracking-tighter"
                    >
                      ${savings.toLocaleString()}
                    </motion.div>
                    <div className="mt-2 inline-block bg-success/20 text-success text-xs font-bold px-2 py-1 rounded">
                      {roi > 0 ? `+${roi}% ROI` : 'Break Even'}
                    </div>
                  </div>
               </div>

               <button className="mt-8 w-full bg-primary text-dark-900 font-bold py-3 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center space-x-2">
                 <span>See Your Custom ROI</span>
                 <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
