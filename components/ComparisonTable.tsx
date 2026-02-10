import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const features = [
    { name: "Annual Cost", human: "$70k - $90k", ai: "$30k - $72k" },
    { name: "Availability", human: "8 hours/day", ai: "24/7/365" },
    { name: "Training Time", human: "3-6 months", ai: "7 days" },
    { name: "Consistency", human: "Variable", ai: "100% Deterministic" },
    { name: "Scalability", human: "Hire & Train (Slow)", ai: "Instant (Click)" },
    { name: "Data Decay", human: "High", ai: "Zero (Real-time)" },
  ];

  return (
    <section className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why Teams Choose Apex
          </h2>
          <p className="text-gray-400">The math doesn't lie. Infrastructure beats payroll.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-6 text-gray-400 font-medium">Feature</th>
                <th className="p-6 text-gray-400 font-medium text-center">In-House SDR Team</th>
                <th className="p-6 text-primary font-bold text-lg text-center bg-primary/5 rounded-t-xl border-t border-x border-primary/20">Revenue OS</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-white font-medium">{row.name}</td>
                  <td className="p-6 text-center text-gray-400">
                     <div className="flex items-center justify-center space-x-2">
                       {row.name === "Annual Cost" ? <span className="text-red-400 font-mono">{row.human}</span> : (
                         <>
                           <X className="text-red-500" size={18} />
                           <span>{row.human}</span>
                         </>
                       )}
                     </div>
                  </td>
                  <td className="p-6 text-center bg-primary/5 border-x border-primary/10">
                     <div className="flex items-center justify-center space-x-2">
                       {row.name === "Annual Cost" ? <span className="text-success font-mono font-bold">{row.ai}</span> : (
                         <>
                           <Check className="text-primary" size={18} />
                           <span className="text-white font-semibold">{row.ai}</span>
                         </>
                       )}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
