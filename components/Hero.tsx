import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO_COPY } from '../constants';
import { ChevronDown, PlayCircle, Calculator } from 'lucide-react';
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
        <div ref={containerRef} className="relative min-h-screen w-full bg-dark-900 overflow-hidden flex flex-col items-center justify-center pt-20">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0 pointer-events-none">
                {/* CSS Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Glow Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full opacity-40 mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-secondary/10 blur-[150px] rounded-full opacity-40 mix-blend-screen" />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900/0 via-dark-900/50 to-dark-900" />
            </div>

            {/* Hero Content */}
            <motion.div 
                className="relative z-20 max-w-5xl w-full px-6 text-center mt-12 md:mt-0"
                style={{ opacity, scale, y }}
            >
                {/* Status Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "outBack" }}
                    className="flex justify-center mb-8"
                >
                        <div className="px-5 py-2 rounded-full border border-warning/20 bg-warning/5 text-warning backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,53,0.1)] hover:bg-warning/10 transition-colors cursor-default">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
                        </span>
                        <span className="text-xs md:text-sm font-bold tracking-wide uppercase">
                            {HERO_COPY.badge}
                        </span>
                    </div>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter text-white drop-shadow-2xl"
                >
                    Your SDR Team Costs $180k. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-pulse">
                        Ours Costs $72k.
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
                >
                    {HERO_COPY.subheadline}
                </motion.p>

                {/* CTAs */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20"
                >
                    <button 
                        onClick={() => {
                            document.getElementById('roi')?.scrollIntoView({ behavior: 'smooth' });
                            handleInteraction('cta_clicked', { source: 'hero_primary' });
                        }}
                        disabled={isLocked}
                        className={`group relative px-8 py-4 bg-primary text-dark-900 text-lg font-bold rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(0,217,255,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(0,217,255,0.5)] ${
                            isLocked ? 'opacity-80 cursor-wait' : ''
                        }`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            {HERO_COPY.primaryCta}
                            <Calculator size={20} className="opacity-90 group-hover:rotate-12 transition-transform" />
                        </span>
                    </button>

                    <button 
                        onClick={() => !isLocked && handleInteraction('cta_clicked', { source: 'hero_secondary' })}
                        className="group px-8 py-4 bg-white/5 border border-white/10 text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-sm"
                    >
                        {HERO_COPY.secondaryCta}
                        <PlayCircle size={20} className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" />
                    </button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="border-t border-white/5 pt-8 max-w-4xl mx-auto"
                >
                    <p className="text-xs text-gray-500 font-mono mb-6 uppercase tracking-widest">Trusted by 100+ B2B companies processing 2,400+ leads daily</p>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
                        {['Stripe', 'Ramp', 'Brex', 'Deel', 'Retool'].map((logo) => (
                            <span key={logo} className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight cursor-default">{logo}</span>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/20 flex flex-col items-center gap-2"
                animate={{ y: [0, 10, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                <ChevronDown size={16} />
            </motion.div>
        </div>
    );
};