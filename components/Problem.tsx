import React from 'react';
import { PROBLEM_CARDS } from '../constants';
import { Clock, Moon, TrendingDown } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'clock': <Clock size={32} className="text-warning" />,
  'moon': <Moon size={32} className="text-secondary" />,
  'trend-down': <TrendingDown size={32} className="text-red-500" />
};

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-24 bg-dark-700 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Your Sales Team Is Trapped in <span className="text-gray-500 line-through decoration-warning">Manual Work</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
             Stop paying humans to do robot work. The traditional SDR model is broken, expensive, and unscalable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PROBLEM_CARDS.map((card, index) => (
            <div 
              key={index}
              className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 group"
            >
              <div className="mb-6 bg-dark-900 w-16 h-16 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                {iconMap[card.icon]}
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">{card.stat}</h3>
              <p className="text-gray-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
           <p className="text-2xl font-light text-primary animate-pulse">
             What if AI handled all of this—perfectly, instantly, 24/7?
           </p>
        </div>
      </div>
    </section>
  );
};
