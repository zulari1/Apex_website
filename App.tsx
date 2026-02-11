import React, { useEffect } from 'react';
import { useSystemStore } from './store/useSystemStore';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { ROICalculator } from './components/ROICalculator';
import { Testimonials } from './components/Testimonials';
import { ComparisonTable } from './components/ComparisonTable';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AgentHUD } from './components/AgentHUD';
import { LiveDemo } from './components/LiveDemo';

const App: React.FC = () => {
  const { setSystemState } = useSystemStore();

  useEffect(() => {
    const timer = setTimeout(() => {
        setSystemState('idle');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-primary/30 bg-dark-900">
      
      {/* System Layers */}
      <AgentHUD />
      <Navbar />

      <main className="relative z-10 w-full">
        <Hero />
        <LiveDemo />
        <div className="relative z-30 bg-dark-900">
            <Problem />
            <Solution />
            {/* Capabilities removed as it's merged into Solution */}
            <ROICalculator />
            <Testimonials />
            <ComparisonTable />
            <Pricing />
            <FAQ />
            <FinalCTA />
        </div>
      </main>

      <Footer />

      {/* Global Grain/Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default App;