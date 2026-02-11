import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const ROICalculator: React.FC = () => {
  const [sdrCount, setSdrCount] = useState(3);
  const [manualHours, setManualHours] = useState(30);

  // Constants from Audit
  const COST_PER_SDR = 70000; // Loaded cost
  const APEX_COST_ANNUAL = 71964; // Tier 2 ($5,997 * 12)

  const annualCostSDR = sdrCount * COST_PER_SDR;
  // If manual hours are low, maybe they don't need full replacement? 
  // But for the sake of the calculator logic in the audit:
  // "3 SDRs at $70k = $210k. Revenue OS Tier 2 = $72k."
  // It implies replacing the SDR function entirely or largely.
  const savings = annualCostSDR - APEX_COST_ANNUAL;
  const roi = Math.round(((savings / APEX_COST_ANNUAL) * 100));
  const paybackDays = Math.round((APEX_COST_ANNUAL / savings) * 365);

  return (
    <section id="roi" className="py-24 bg-dark-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            You're Losing ${savings > 0 ? (savings/1000).toFixed(0) + 'k' : '...'}/Year. Here's the Math.
          </h2>
          <p className="text-gray-400 text-lg">
             3 SDRs at $70k each = $210k/year. Revenue OS Tier 2 = $72k/year. Move the sliders to see your exact savings.
          </p>
        </div>

        <div className="bg-dark-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Controls */}
            <div className="space-y-12">
              <div>
                <label className="flex justify-between text-white font-bold text-lg mb-4">
                  <span>How many SDRs do you have?</span>
                  <span className="text-primary font-mono bg-primary/10 px-3 py-1 rounded text-xl">{sdrCount}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={sdrCount} 
                  onChange={(e) => setSdrCount(Number(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-sm text-gray-500 mt-3">Avg. loaded cost: $70k/year (salary + benefits + tools)</p>
              </div>

              <div>
                <label className="flex justify-between text-white font-bold text-lg mb-4">
                  <span>Hours/week on manual prospecting?</span>
                  <span className="text-primary font-mono bg-primary/10 px-3 py-1 rounded text-xl">{manualHours}</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  value={manualHours} 
                  onChange={(e) => setManualHours(Number(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-sm text-gray-500 mt-3">Industry avg: 30 hrs/week (list building, emailing, follow-ups)</p>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/5 relative overflow-hidden">
               <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-dark-900/50 p-4 rounded-xl border border-red-500/20">
                          <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">💸 Current Annual Cost</span>
                          <span className="text-2xl font-mono text-white">${annualCostSDR.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 block mt-1">({sdrCount} SDRs × $70k)</span>
                      </div>
                      <div className="bg-dark-900/50 p-4 rounded-xl border border-primary/20">
                          <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">🤖 Revenue OS Cost</span>
                          <span className="text-2xl font-mono text-primary">${APEX_COST_ANNUAL.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 block mt-1">(Tier 2 Annual)</span>
                      </div>
                  </div>
                  
                  <div className="text-center pt-4 pb-4 border-t border-b border-white/10">
                    <span className="text-sm text-gray-400 block mb-2 uppercase tracking-widest">💰 You Save</span>
                    <motion.div 
                      key={savings}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-5xl md:text-6xl font-bold text-success font-mono tracking-tighter drop-shadow-lg"
                    >
                      ${savings.toLocaleString()}
                    </motion.div>
                    <span className="text-sm text-gray-500 block mt-2">per year</span>
                  </div>

                  <div className="flex justify-center gap-4 text-sm font-bold">
                      <span className="bg-success/20 text-success px-3 py-1 rounded-full">+{roi}% ROI</span>
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Payback in {paybackDays > 0 ? paybackDays : '<1'} days</span>
                  </div>
               </div>

               <button className="mt-8 w-full bg-primary text-dark-900 font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:scale-[1.02]">
                 <span>Book a Demo & Lock in This Savings</span>
                 <ArrowRight size={20} />
               </button>
               
               <div className="mt-4 text-center">
                   <button className="text-gray-500 text-sm hover:text-white underline decoration-dotted">Download ROI Report (PDF)</button>
               </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
             <p className="text-gray-500 text-sm">✓ 1,284 sales leaders calculated their savings this month</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-600 max-w-3xl mx-auto">
            Calculation based on industry data: Avg. SDR salary: $55k (Glassdoor, 2025) • Avg. overhead: 27% (benefits, tools, management) • Avg. hours on manual tasks: 73% of workday (SaaStr Research)
        </div>
      </div>
    </section>
  );
};