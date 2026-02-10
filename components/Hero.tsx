
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO_COPY } from '../constants';
import { ChevronDown, MessageSquare, Loader2 } from 'lucide-react';
import { useSystemStore } from '../store/useSystemStore';

export const Hero: React.FC = () => {
    const { handleInteraction, isLocked } = useSystemStore();
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    return (
        <div ref={containerRef} className="relative h-[120vh] w-full bg-dark-900 overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900" />
            </div>

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center">
                
                {/* Hero Content */}
                <motion.div 
                    className="relative z-20 max-w-6xl w-full px-6 text-center"
                    style={{ opacity, scale, y }}
                >
                    {/* Status Badge */}
                    <div className="flex justify-center mb-8">
                         <div className="px-4 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2 border-primary/30 bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                            <div className="w-2 h-2 rounded-full animate-pulse bg-primary" />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">
                                REVENUE OS: ONLINE
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
                        The Autonomous <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r animate-pulse-glow from-primary via-white to-primary">
                            Revenue Engine
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                        {HERO_COPY.subheadline}
                    </p>

                    {/* Primary CTA */}
                    <div className="flex flex-col items-center gap-6">
                        <button 
                            onClick={() => !isLocked && handleInteraction('cta_clicked', { source: 'hero_primary' })}
                            disabled={isLocked}
                            className={`group relative px-8 py-4 bg-primary text-dark-900 text-lg font-bold rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(0,217,255,0.3)] ${
                                isLocked ? 'opacity-80 scale-95 cursor-wait' : 'hover:scale-105'
                            }`}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isLocked ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Connecting to Atlas...
                                    </>
                                ) : (
                                    <>
                                        Replace Your SDR Team
                                        <MessageSquare size={18} className="opacity-60" />
                                    </>
                                )}
                            </span>
                            <div className={`absolute inset-0 bg-white/20 transition-transform duration-300 ${
                                isLocked ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
                            }`} />
                        </button>
                        
                        <p className="text-sm text-gray-500">
                            Atlas AI will guide your setup • No credit card required
                        </p>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div 
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30 flex flex-col items-center gap-2"
                    animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                    <ChevronDown size={20} />
                </motion.div>
            </div>
        </div>
    );
};
