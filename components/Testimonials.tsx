import React from 'react';
import { TESTIMONIALS, STATS } from '../constants';
import { CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="proof" className="py-24 bg-dark-800 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 border-b border-white/5 pb-12">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center group">
              <div className="mb-4 text-primary bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform">
                  {stat.icon && <stat.icon size={32} />}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white font-mono mb-2">{stat.value}</div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            "I Was Skeptical. Then I Saw the Results."
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-dark-900 rounded-2xl border border-white/10 overflow-hidden hover:-translate-y-2 transition-transform duration-300 shadow-xl">
              <div className="p-8 space-y-6">
                
                {/* Before */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                    <span className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2 block">Before</span>
                    <p className="text-gray-300 text-sm leading-relaxed italic opacity-80">{t.before}</p>
                </div>

                {/* After */}
                <div className="bg-success/5 border border-success/10 rounded-xl p-4">
                    <span className="text-success text-xs font-bold uppercase tracking-wider mb-2 block">After</span>
                    <p className="text-white text-sm leading-relaxed font-medium">{t.after}</p>
                </div>

                {/* Result */}
                <div className="flex items-start gap-2 pt-2">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-white font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">RESULT: {t.result}</span>
                </div>
              </div>

              <div className="bg-white/5 p-6 border-t border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role} @ {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo Ticker Placeholder */}
        <div className="mt-20 border-t border-white/5 pt-12">
            <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-widest">Trusted by 100+ B2B Companies</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {['Stripe', 'Ramp', 'Brex', 'Deel', 'Retool', 'Vanta', 'Scale'].map(logo => (
               <span key={logo} className="text-xl font-bold text-white">{logo}</span>
             ))}
          </div>
          <div className="text-center mt-12 space-y-2 text-sm text-gray-500">
             <p>📊 G2 Rating: 4.8/5 (127 reviews) • ⭐ Rated #1 AI SDR Platform by SaaStr 2025</p>
          </div>
        </div>
      </div>
    </section>
  );
};