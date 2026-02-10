import React, { useState } from 'react';
import { CAPABILITY_TABS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const [activeTab, setActiveTab] = useState(CAPABILITY_TABS[0].id);
  const activeFeature = CAPABILITY_TABS.find(t => t.id === activeTab) || CAPABILITY_TABS[0];

  return (
    <section id="capabilities" className="py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything Your SDR Team Does. Automated.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Tab Navigation */}
          <div className="lg:col-span-4 flex flex-col space-y-2">
            {CAPABILITY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-200 border ${
                  activeTab === tab.id 
                    ? 'bg-white/10 border-primary/50 text-white shadow-lg' 
                    : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className={activeTab === tab.id ? 'text-primary' : 'text-gray-500'} size={24} />
                <span className="font-semibold text-lg">{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-dark-900 border border-white/10 rounded-2xl p-8 md:p-12 h-full flex flex-col justify-center"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <activeFeature.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">{activeFeature.title}</h3>
                </div>
                
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  {activeFeature.description}
                </p>

                <div className="space-y-4 mb-8">
                  {activeFeature.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-300">
                      <CheckCircle2 size={20} className="text-success" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                   <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm text-gray-400 border border-white/5">
                     <span className="text-success">system_log &gt;</span> Initiating {activeFeature.title.toLowerCase()} module... <span className="animate-pulse">|</span>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
