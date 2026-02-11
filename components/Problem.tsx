import React from 'react';
import { PROBLEM_CARDS } from '../constants';
import { Clock, Moon, TrendingDown } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'clock': <Clock size={48} className="text-warning" />,
  'moon': <Moon size={48} className="text-secondary" />,
  'trend-down': <TrendingDown size={48} className="text-red-500" />
};

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-24 bg-dark-700 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your Sales Team Burns $18,000/Month on <br className="hidden md:block" />
            <span className="relative inline-block mt-1">
                <span className="relative z-10 text-primary">Tasks Revenue OS Solves Instantly</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -rotate-1 rounded-full -z-0"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
             Manual prospecting, list building, email writing, and follow-ups. Your team does this 6 hours/day. <span className="text-white font-semibold">Revenue OS</span> does it in 6 seconds—so they can focus on closing deals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PROBLEM_CARDS.map((card, index) => (
            <div 
              key={index}
              className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 group hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-8 bg-dark-900 w-24 h-24 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all group-hover:scale-110">
                {iconMap[card.icon]}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{card.stat}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
           <p className="text-2xl font-light text-primary animate-pulse">
             What if AI ran your prospecting 24/7—at $0.02/lead instead of $6/lead?
           </p>
        </div>
      </div>
    </section>
  );
};