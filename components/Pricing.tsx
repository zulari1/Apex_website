import React from 'react';
import { PRICING_TIERS } from '../constants';
import { Check, Loader2, Sparkles, AlertCircle, X, HelpCircle, ArrowRight } from 'lucide-react';
import { useSystemStore } from '../store/useSystemStore';

export const Pricing: React.FC = () => {
  const { handleInteraction, isLocked, atlasState } = useSystemStore();
  
  // SAFE ACCESS: Optional chaining ensures no crash if data is undefined
  const recommendedTierName = atlasState.data?.recommended_tier;

  return (
    <section id="pricing" className="py-24 bg-dark-700 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Scarcity Header */}
        <div className="flex justify-center mb-8">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
                <span>🔥</span> 7 Deployment Slots Remaining This Month
            </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Replace $180k in SDR Costs with <br/><span className="text-primary">$72k in AI Infrastructure</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            All tiers include 7-day deployment, 30-day money-back guarantee, and cancel anytime. Email-only (Tier 1-2). LinkedIn coming Q2 2025. WhatsApp in Tier 3 (beta).
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PRICING_TIERS.map((tier, index) => {
            const isRecommended = recommendedTierName === tier.name;
            const isHighlight = tier.highlight || isRecommended;

            return (
              <div 
                key={index}
                className={`relative bg-dark-900 border rounded-2xl flex flex-col h-full transition-all duration-500 ${
                  isHighlight 
                    ? 'border-primary shadow-[0_0_40px_rgba(0,217,255,0.15)] z-10 scale-105' 
                    : 'border-white/10 hover:-translate-y-2'
                }`}
              >
                {/* Headers / Badges */}
                {isRecommended && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-dark-900 font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-bounce z-20">
                        <Sparkles size={16} />
                        Atlas Recommended
                    </div>
                )}
                {tier.badge && !isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase px-4 py-1 rounded-full shadow-lg z-20">
                    {tier.badge}
                  </div>
                )}
                
                <div className="p-8 pb-0">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 min-h-[60px] leading-relaxed">{tier.description}</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold text-white font-mono tracking-tight">{tier.price}</span>
                    <span className="text-gray-500 ml-2">{tier.period}</span>
                  </div>

                  <button 
                    onClick={() => !isLocked && handleInteraction('cta_clicked', { source: 'pricing', tier: tier.name })}
                    disabled={isLocked}
                    className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                      isHighlight 
                        ? 'bg-primary text-dark-900 hover:bg-primary/90 shadow-lg shadow-primary/20' 
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

                  {isHighlight && (
                      <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
                          <p>✓ Replaces $180k in SDR costs</p>
                          <p>✓ 40-70 meetings/month</p>
                          <p>✓ ROI in 60-90 days</p>
                      </div>
                  )}
                </div>

                <div className="p-8 space-y-4">
                  <div className="h-px bg-white/10 mb-6" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">What's Included</p>
                  
                  {tier.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-3">
                      <Check size={18} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}

                  {tier.notIncluded && tier.notIncluded.length > 0 && (
                      <div className="pt-4 mt-4 border-t border-white/5 space-y-3 opacity-60">
                        {tier.notIncluded.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-start space-x-3 text-gray-500">
                                <X size={18} className="mt-0.5 shrink-0" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Helper Selector */}
        <div className="mt-20 border-t border-white/10 pt-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                        <HelpCircle size={20} className="text-gray-400" />
                        🤔 Not sure which tier?
                    </h4>
                    <p className="text-gray-400 text-sm">Use our AI selector: Answer 3 questions, get a personalized recommendation.</p>
                </div>
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
                    Start Selector <ArrowRight size={16} />
                </button>
            </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-xs">
          All pricing is monthly subscription. Cancel anytime.
        </div>
      </div>
    </section>
  );
};