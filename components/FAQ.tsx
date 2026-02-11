import React, { useState } from 'react';
import { FAQS } from '../constants';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-dark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            "Wait, How Is This Different from [Competitor]?"
          </h2>
          <p className="text-gray-400 text-lg">
             847 sales leaders asked these questions before deploying Atlas. Here's what we told them.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white font-medium pr-8 text-lg">{faq.question}</span>
                {openIndex === idx ? <Minus className="text-primary shrink-0" /> : <Plus className="text-gray-500 shrink-0" />}
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-8 text-gray-300 leading-relaxed text-base border-t border-white/5 pt-4">
                      {faq.answer}
                      {idx === 0 && (
                          <button className="mt-4 text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                              See Feature Comparison Table <ArrowRight size={14} />
                          </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};