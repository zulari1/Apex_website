import React from 'react';
import { TESTIMONIALS, STATS } from '../constants';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="proof" className="py-24 bg-dark-800 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 border-b border-white/5 pb-12">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white font-mono mb-2">{stat.value}</div>
              <div className="text-primary font-medium uppercase tracking-wider text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Trusted by Sales Leaders Who Refuse to Scale the Old Way
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-dark-900 p-8 rounded-2xl border border-white/10 relative">
              <Quote className="absolute top-8 left-8 text-white/5" size={48} />
              <p className="text-gray-300 relative z-10 mb-6 leading-relaxed italic">"{t.quote}"</p>
              
              <div className="mt-auto flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role} @ {t.company}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="text-xs font-mono text-success bg-success/10 inline-block px-2 py-1 rounded">
                   RESULT: {t.metric}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo Grid Placeholder */}
        <div className="mt-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center justify-items-center">
             {/* Using text for logos to keep it simple as no images provided */}
             {['Stripe', 'Ramp', 'Brex', 'Deel', 'Retool', 'Vanta'].map(logo => (
               <span key={logo} className="text-xl font-bold text-white">{logo}</span>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};
