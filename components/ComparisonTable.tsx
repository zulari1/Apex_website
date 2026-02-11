import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const features = [
    { name: "Annual Cost", human: "$210,000", ai: "$71,964", subHuman: "($70k × 3 SDRs)", subAi: "($5,997/mo × 12)" },
    { name: "Availability", human: "8 hours/day", ai: "24/7/365", subHuman: "Nights, weekends = dark", subAi: "Booking meetings at 2am" },
    { name: "Training Time", human: "3-6 months", ai: "7 days", subHuman: "Ramp time + onboarding", subAi: "Connect accounts + train AI" },
    { name: "Consistency", human: "Variable", ai: "100% Deterministic", subHuman: "Sick days, burnout, turnover", subAi: "Same performance, every day" },
    { name: "Scalability", human: "Hire & Train (Slow)", ai: "Instant", subHuman: "Recruiter fees, benefits", subAi: "Add 5,000 more leads = 1 click" },
    { name: "Data Accuracy", human: "15-20% bounce rates", ai: "<1% bounce rate", subHuman: "Outdated lists, manual entry", subAi: "Real-time waterfall verification" },
    { name: "Meeting Intelligence", human: "Not Included", ai: "Included (Tier 2+)", subHuman: "Buy Gong separately = $30k/yr", subAi: "Transcripts, coaching, analysis" },
  ];

  return (
    <section className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Infrastructure vs. Payroll: The Numbers Don't Lie
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            One option costs $180k/year and requires constant management. The other costs $72k and runs itself. You decide.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-gray-400 font-medium">Feature</th>
                <th className="p-6 text-gray-400 font-medium text-center bg-red-500/5">In-House SDR Team (3 SDRs)</th>
                <th className="p-6 text-primary font-bold text-lg text-center bg-primary/10 border-l border-primary/20">Revenue OS (Tier 2)</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6 text-white font-medium">{row.name}</td>
                  <td className="p-6 text-center bg-red-500/5 group-hover:bg-red-500/10 transition-colors">
                     <div className="flex flex-col items-center justify-center">
                       <div className="flex items-center space-x-2">
                           {row.name === "Annual Cost" ? null : <X className="text-red-500" size={18} />}
                           <span className={row.name === "Annual Cost" ? "text-red-400 font-mono font-bold text-lg" : "text-gray-300"}>{row.human}</span>
                       </div>
                       <span className="text-xs text-gray-500 mt-1">{row.subHuman}</span>
                     </div>
                  </td>
                  <td className="p-6 text-center bg-primary/5 border-l border-primary/10 group-hover:bg-primary/10 transition-colors relative">
                     <div className="flex flex-col items-center justify-center">
                       <div className="flex items-center space-x-2">
                           {row.name === "Annual Cost" ? null : <Check className="text-primary" size={18} />}
                           <span className={row.name === "Annual Cost" ? "text-success font-mono font-bold text-lg" : "text-white font-semibold"}>{row.ai}</span>
                       </div>
                       <span className="text-xs text-gray-400 mt-1">{row.subAi}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5-Year Analysis */}
        <div className="mt-12 bg-dark-800 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
             <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                 <span className="text-xl">📊</span> The 5-Year Cost Comparison
             </h4>
             <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div>
                     <p className="text-gray-400 text-sm mb-1">In-House SDR Team</p>
                     <p className="text-3xl font-mono text-red-400 font-bold">$1,050,000</p>
                     <p className="text-xs text-gray-500 mt-1">3 SDRs × $70k × 5 years (0% raises)</p>
                 </div>
                 <div>
                     <p className="text-gray-400 text-sm mb-1">Revenue OS Tier 2</p>
                     <p className="text-3xl font-mono text-success font-bold">$359,820</p>
                     <p className="text-xs text-gray-500 mt-1">Assumes 10% annual price increase</p>
                 </div>
             </div>
             <div className="border-t border-white/10 pt-6">
                 <p className="text-lg text-white font-medium">
                     <span className="text-primary font-bold">YOU SAVE: $690,180</span> over 5 years.
                 </p>
                 <p className="text-sm text-gray-400 mt-2">
                     That's enough to hire 2 senior AEs, fund a conference sponsorship, or boost your marketing budget by 40%.
                 </p>
             </div>
             <div className="mt-8 text-center">
                 <button className="text-primary hover:text-white transition-colors font-bold flex items-center justify-center gap-2 mx-auto">
                     See How This Applies to Your Team <Check size={16} />
                 </button>
             </div>
        </div>
      </div>
    </section>
  );
};