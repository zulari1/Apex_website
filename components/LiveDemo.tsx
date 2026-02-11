
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../store/useSystemStore';
import { Search, Mail, Loader2, ArrowRight, Check, Copy, Sparkles, Lock, RefreshCw, AlertCircle } from 'lucide-react';

type DemoPhase = 
  | 'idle' 
  | 'email_input' 
  | 'processing_research' 
  | 'show_report' 
  | 'processing_emails' 
  | 'show_emails';

interface ResearchResponse {
  resumeurl: string;
  research_report: string;
}

interface EmailContent {
  subject: string;
  body: string;
}

interface EmailsResponse {
  email1: EmailContent;
  email2: EmailContent;
  email3: EmailContent;
}

export const LiveDemo: React.FC = () => {
  const { handleInteraction } = useSystemStore();
  
  // State
  const [phase, setPhase] = useState<DemoPhase>('idle');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [researchData, setResearchData] = useState<ResearchResponse | null>(null);
  const [generatedEmails, setGeneratedEmails] = useState<EmailContent[]>([]);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Loaders
  useEffect(() => {
    if (phase === 'processing_research') {
      const messages = [
        "Analyzing digital footprint...",
        "Understanding market positioning...",
        "Generating consultant-grade research...",
        "Identifying value gaps..."
      ];
      let i = 0;
      setLoadingText(messages[0]);
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingText(messages[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
    if (phase === 'processing_emails') {
      const messages = [
        "Writing hyper-personalized emails...",
        "Matching tone to your positioning...",
        "Optimizing for reply rates...",
        "Applying persuasion psychology..."
      ];
      let i = 0;
      setLoadingText(messages[0]);
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingText(messages[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Handlers
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setPhase('email_input');
  };

  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check: ensure we have both inputs
    if (!url.trim()) {
        setPhase('idle');
        return;
    }
    if (!email.trim()) return;
    
    setPhase('processing_research');
    setError(null);

    const payload = {
        linkedin_or_company: url,
        user_email: email
    };

    console.log('[LiveDemo] Sending Research Request:', payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      let response;
      
      // ATTEMPT 1: Standard JSON (Matches Atlas Protocol)
      try {
          response = await fetch('https://apex-dev.app.n8n.cloud/webhook/services_demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
      } catch (networkErr: any) {
          // If this is an AbortError (Timeout), throw it up to the main catch
          if (networkErr.name === 'AbortError') throw networkErr;
          
          // ATTEMPT 2: Fallback to text/plain to bypass CORS Preflight (OPTIONS)
          // This fixes "Failed to fetch" if the server doesn't handle OPTIONS correctly
          console.warn('[LiveDemo] Standard JSON failed (CORS/Network), retrying with Simple Request...', networkErr);
          response = await fetch('https://apex-dev.app.n8n.cloud/webhook/services_demo', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
      }

      clearTimeout(timeoutId);

      if (!response || !response.ok) {
          const errText = response ? await response.text().catch(() => 'No error text') : 'Network Error';
          console.error('[LiveDemo] Webhook Error:', response?.status, errText);
          throw new Error(`Research generation failed: ${response?.status || 'Unknown'}`);
      }

      const data: ResearchResponse[] = await response.json();
      
      // Validate Response Structure
      if (Array.isArray(data) && data.length > 0 && data[0].research_report) {
        console.log('[LiveDemo] Research Data Received.');
        setResearchData(data[0]);
        setPhase('show_report');
      } else {
        console.error('[LiveDemo] Invalid Data Format:', data);
        throw new Error('Invalid response format received from AI agent.');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('[LiveDemo] Exception:', err);
      
      let errorMessage = 'Failed to generate research. Please try again.';
      if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. The analysis is taking longer than expected.';
      } else if (err.message && err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection or ad-blockers.';
      }

      setError(errorMessage);
      setPhase('email_input');
    }
  };

  const handleGenerateEmails = async () => {
    if (!researchData?.research_report) {
        console.error('[LiveDemo] Missing research data');
        setError('Configuration error: Missing research data.');
        return;
    }
    
    setPhase('processing_emails');
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const targetUrl = 'https://apex-dev.app.n8n.cloud/webhook/email_designer';
      console.log('[LiveDemo] Triggering Email Generation via:', targetUrl);
      
      let response;
      // Construct payload with report, email, and url
      const emailPayload = {
          email: email,
          linkedin_or_company: url, 
          research_report: researchData.research_report,
          trigger: 'generate_emails' 
      };

      // Same Robust Dual-Fetch Strategy
      try {
          response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload),
            signal: controller.signal
          });
      } catch (networkErr: any) {
           if (networkErr.name === 'AbortError') throw networkErr;
           
           console.warn('[LiveDemo] Email gen fallback to simple request...', networkErr);
           response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(emailPayload),
            signal: controller.signal
          });
      }
      
      clearTimeout(timeoutId);

      if (!response || !response.ok) {
          throw new Error(`Email generation failed: ${response?.status}`);
      }

      const data: EmailsResponse[] = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const emailsObj = data[0];
        setGeneratedEmails([
          emailsObj.email1,
          emailsObj.email2,
          emailsObj.email3
        ]);
        setPhase('show_emails');
      } else {
        throw new Error('Invalid email format received');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('[LiveDemo] Email Gen Error:', err);
      setError('Failed to generate emails. System might be busy.');
      setPhase('show_report');
    }
  };

  const handleFinalCTA = () => {
    handleInteraction('live_demo_cta_clicked', { email, url });
    // Scroll to pricing or open booking
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to safely render the HTML report
  const processHtml = (html: string) => {
    // Scope the CSS to avoid breaking the main app
    // Replace 'body' selector with our container class
    return html
      .replace(/body\s*{/g, '.research-scope {')
      .replace(/body\s/g, '.research-scope ')
      // Ensure specific elements don't overflow
      .replace(/table\s*{/g, 'table { width: 100%; display: block; overflow-x: auto; ')
      .replace(/<img/g, '<img style="max-width: 100%; height: auto;"');
  };

  return (
    <section className="py-24 relative bg-dark-900 overflow-hidden border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
            <Sparkles size={12} />
            Live Product Experience
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Try Revenue OS On Yourself
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            In 30 seconds, see the exact outreach our system would send if you were the lead.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="relative mx-auto bg-dark-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
          
          {/* --- PHASE: INPUTS --- */}
          <AnimatePresence mode="wait">
            {(phase === 'idle' || phase === 'email_input') && (
              <motion.div 
                key="input-phase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center items-center p-8 md:p-12"
              >
                {phase === 'idle' ? (
                  <form onSubmit={handleUrlSubmit} className="w-full max-w-lg space-y-6">
                    <div className="space-y-2 text-center mb-8">
                       <h3 className="text-2xl font-bold text-white">Where should we start?</h3>
                       <p className="text-gray-400 text-sm">Paste your LinkedIn profile or company website.</p>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                      </div>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="linkedin.com/in/you or company.com"
                        className="w-full bg-dark-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-lg"
                        autoFocus
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={!url}
                      className="w-full bg-white text-dark-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Step <ArrowRight size={20} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResearchSubmit} className="w-full max-w-lg space-y-6">
                    <div className="space-y-2 text-center mb-8">
                       <h3 className="text-2xl font-bold text-white">Where should we send the report?</h3>
                       <p className="text-gray-400 text-sm">We'll analyze {url} and email you the findings.</p>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Mail className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-dark-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-lg"
                        autoFocus
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={!email}
                      className="w-full bg-primary text-dark-900 font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 shadow-[0_0_20px_rgba(0,217,255,0.3)]"
                    >
                      Generate My Research <Sparkles size={20} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPhase('idle')}
                      className="w-full text-gray-500 text-sm hover:text-white transition-colors"
                    >
                      Back
                    </button>
                  </form>
                )}
                {error && (
                  <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- PHASE: PROCESSING --- */}
          <AnimatePresence mode="wait">
            {(phase === 'processing_research' || phase === 'processing_emails') && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center items-center p-12 text-center"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                  <Sparkles className="absolute inset-0 m-auto text-white animate-bounce" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Revenue OS is Working</h3>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-primary font-mono text-sm uppercase tracking-widest"
                  >
                    {loadingText}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- PHASE: SHOW REPORT --- */}
          <AnimatePresence>
            {phase === 'show_report' && researchData && (
              <motion.div 
                key="report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-[800px]" // Fixed height for scroll
              >
                <div className="bg-dark-900 border-b border-white/10 p-4 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-sm font-bold text-white">Research Complete</span>
                  </div>
                  <button 
                     onClick={() => setPhase('idle')}
                     className="text-xs text-gray-500 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> Start Over
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white text-black font-sans research-scope custom-html-render">
                   {/* DANGEROUS HTML RENDER */}
                   <div dangerouslySetInnerHTML={{ __html: processHtml(researchData.research_report) }} />
                </div>

                <div className="bg-dark-900 border-t border-white/10 p-6 md:p-8 shrink-0">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <h4 className="text-white font-bold text-lg mb-1">This is how Revenue OS sees your business.</h4>
                        <p className="text-gray-400 text-sm">Now, let's see how it uses this data to write perfect outbound.</p>
                      </div>
                      <button 
                        onClick={handleGenerateEmails}
                        className="bg-primary text-dark-900 font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] whitespace-nowrap"
                      >
                        Turn This Into Outreach Emails <ArrowRight size={20} />
                      </button>
                   </div>
                   {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- PHASE: SHOW EMAILS --- */}
          <AnimatePresence>
            {phase === 'show_emails' && (
              <motion.div 
                key="emails"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full min-h-[600px] p-8"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Launch</h3>
                  <p className="text-gray-400 text-sm">These are the exact emails Revenue OS would send on your behalf.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-white/10 pr-2">
                   {generatedEmails.map((emailData, idx) => (
                     <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col hover:bg-white/10 transition-colors group"
                     >
                        <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                           <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                             Email #{idx + 1}
                           </span>
                           <button className="text-gray-500 hover:text-white transition-colors" title="Copy">
                              <Copy size={14} />
                           </button>
                        </div>
                        {emailData.subject && (
                          <div className="mb-4">
                            <span className="text-xs text-gray-500 block">Subject</span>
                            <h4 className="text-white font-medium text-sm">{emailData.subject}</h4>
                          </div>
                        )}
                        <div className="text-gray-300 text-sm leading-relaxed grow whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: emailData.body }} />
                     </motion.div>
                   ))}
                </div>

                <div className="mt-auto text-center pt-8 border-t border-white/5">
                  <button 
                    onClick={handleFinalCTA}
                    className="w-full md:w-auto bg-success text-dark-900 text-lg font-bold py-4 px-12 rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,245,160,0.3)] flex items-center justify-center gap-2 mx-auto"
                  >
                    I Want This Running For My Business <Check size={24} />
                  </button>
                  <p className="text-gray-500 text-xs mt-4">
                    <Lock size={10} className="inline mr-1" />
                    Secure configuration. Your data is never shared.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .research-scope h1, .research-scope h2, .research-scope h3 { color: #111 !important; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        .research-scope p { margin-bottom: 1em; line-height: 1.6; color: #333; }
        .research-scope table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.9em; }
        .research-scope th { background: #f3f4f6; text-align: left; padding: 12px; border: 1px solid #e5e7eb; color: #111; }
        .research-scope td { padding: 12px; border: 1px solid #e5e7eb; color: #333; }
        .research-scope ul { padding-left: 20px; list-style-type: disc; margin-bottom: 1em; color: #333; }
        .research-scope li { margin-bottom: 0.5em; }
        .research-scope a { color: #2563eb; text-decoration: underline; }
        .custom-html-render img { border-radius: 8px; margin-bottom: 1em; }
      `}</style>
    </section>
  );
};
