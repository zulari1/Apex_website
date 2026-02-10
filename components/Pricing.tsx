
import React from 'react';
import { PRICING_TIERS } from '../constants';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useSystemStore } from '../store/useSystemStore';

export const Pricing: React.FC = () => {
  const { handleInteraction, isLocked, atlasState } = useSystemStore();

  const recommendedTierName = atlasState.data.recommended_tier;

  return (
    <section id="pricing" className="py-24 bg-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pick Your Revenue Growth Plan
          </h2>
          <p className="text-gray-400">All plans include 7-day setup, 30-day guarantee, no long-term contracts.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {PRICING_TIERS.map((tier, index) => {
            const isRecommended = recommendedTierName === tier.name;
            const isHighlight = tier.highlight || isRecommended;

            return (
              <div 
                key={index}
                className={`relative bg-dark-900 border rounded-2xl p-8 flex flex-col h-full transition-all duration-500 ${
                  isHighlight 
                    ? 'border-primary shadow-[0_0_40px_rgba(0,217,255,0.15)] scale-105 z-10' 
                    : 'border-white/10 hover:-translate-y-2'
                } ${isRecommended ? 'ring-2 ring-primary ring-offset-4 ring-offset-dark-900' : ''}`}
              >
                {/* Atlas Recommendation Badge */}
                {isRecommended && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-dark-900 font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                        <Sparkles size={16} />
                        Atlas Recommended
                    </div>
                )}

                {/* Standard Badge */}
                {tier.highlight && !isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{tier.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white font-mono tracking-tight">{tier.price}</span>
                    <span className="text-gray-500 ml-2">{tier.period}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-3">
                      <Check size={18} className="text-primary mt-1 shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => !isLocked && handleInteraction('cta_clicked', { source: 'pricing', tier: tier.name })}
                  disabled={isLocked}
                  className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                    isHighlight 
                      ? 'bg-primary text-dark-900 hover:bg-primary/90' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLocked ? (
                     <>
                       <Loader2 size={16} className="animate-spin" />
                       Deploying...
                     </>
                  ) : (
                     tier.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          All pricing is monthly subscription. Cancel anytime.
        </div>
      </div>
    </section>
  );
};
