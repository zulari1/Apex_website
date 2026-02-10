import React from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Send, Inbox, CalendarCheck } from 'lucide-react';

const steps = [
  { icon: Database, label: "Lead Scraping", desc: "50+ Data Sources" },
  { icon: Search, label: "AI Research", desc: "Deep Entity Profiling" },
  { icon: Send, label: "Outreach", desc: "Hyper-Personalized" },
  { icon: Inbox, label: "Inbox AI", desc: "Automated Triage" },
  { icon: CalendarCheck, label: "Setter", desc: "Meeting Booked" },
];

export const Solution: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-dark-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            The Complete AI Revenue Operating System
          </h2>
          <p className="text-gray-400 text-lg">5 AI Systems Working Together = Your Entire Sales Process, Automated</p>
        </div>

        {/* Animated Flow Diagram */}
        <div className="relative">
          {/* Connection Line Background */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full overflow-hidden">
             <motion.div 
               className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent"
               animate={{ x: ['-100%', '100%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-dark-800 border-2 border-white/10 rounded-2xl flex items-center justify-center mb-6 relative transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                  <step.icon size={32} className="text-gray-400 group-hover:text-primary transition-colors" />
                  
                  {/* Pulse Dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-dark-900 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div>
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2">{step.label}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
