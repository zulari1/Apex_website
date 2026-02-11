import React from 'react';
import { motion } from 'framer-motion';
import { SOLUTION_STEPS } from '../constants';
import { CheckCircle2 } from 'lucide-react';

export const Solution: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-dark-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Revenue OS Runs Your Entire Sales Pipeline—From Cold Lead to Booked Meeting
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Each agent handles one part of the sales process—so you never touch a spreadsheet, write a cold email, or chase a lead again.
          </p>
        </div>

        <div className="relative space-y-32">
          {/* Connecting Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2 hidden md:block" />

          {SOLUTION_STEPS.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex flex-col md:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 w-full">
                <div className={`flex flex-col ${index % 2 === 1 ? 'md:items-start' : 'md:items-end'} text-center ${index % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                   <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
                      <step.icon size={32} className="text-primary" />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{step.headline}</h3>
                   <p className="text-gray-400 text-lg leading-relaxed mb-6">
                     {step.description}
                   </p>
                   <ul className={`space-y-3 ${index % 2 === 1 ? 'items-start' : 'items-end'} flex flex-col`}>
                     {step.stats.map((stat, i) => (
                       <li key={i} className="flex items-center gap-3 text-white font-medium">
                         {index % 2 === 1 && <CheckCircle2 size={18} className="text-success" />}
                         {stat}
                         {index % 2 === 0 && <CheckCircle2 size={18} className="text-success" />}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-dark-900 border-4 border-primary z-10 hidden md:block"></div>

              {/* Visual Side (Placeholder for screenshot) */}
              <div className="flex-1 w-full">
                <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 h-64 md:h-80 flex items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-all shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <step.icon size={64} className="text-white/10 group-hover:text-primary/20 transition-all duration-500 transform group-hover:scale-110" />
                    <div className="absolute bottom-4 right-4 bg-dark-900/80 backdrop-blur px-3 py-1 rounded text-xs text-primary font-mono border border-primary/20">
                        {step.title}
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
            <p className="text-xl md:text-2xl font-light text-white">
                From cold lead to calendar invite—<span className="text-primary font-bold">Revenue OS does it all</span> while you focus on closing deals.
            </p>
        </div>
      </div>
    </section>
  );
};