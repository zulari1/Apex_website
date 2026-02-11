
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSystemStore, OrbEmotion, SystemState, ChatMessage } from '../store/useSystemStore';
import { ArrowRight, Mic, MicOff, History, Loader2, X, Calendar, ShieldCheck, ExternalLink, Terminal, RefreshCw, AlertTriangle, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssemblyAIClient } from '../services/assemblyService';

// --- VISUAL CONSTANTS ---
const ORB_COLORS = {
  neutral: { glow: '#00D9FF', core: '#E0F2FE', nebula: '#0284C7' }, // Cyan
  curious: { glow: '#A855F7', core: '#F3E8FF', nebula: '#9333EA' }, // Purple
  attentive: { glow: '#3B82F6', core: '#DBEAFE', nebula: '#2563EB' }, // Blue
  confident: { glow: '#00D9FF', core: '#E0F2FE', nebula: '#06B6D4' }, // Cyan
  inviting: { glow: '#10B981', core: '#D1FAE5', nebula: '#059669' }, // Emerald
  celebratory: { glow: '#F59E0B', core: '#FEF3C7', nebula: '#D97706' }, // Gold
  concerned: { glow: '#EF4444', core: '#FEE2E2', nebula: '#DC2626' }, // Red (Error)
};

const STATE_COLORS = {
  idle: ORB_COLORS.neutral,
  listening: { glow: '#F472B6', core: '#FCE7F3', nebula: '#DB2777' }, // Pink
  processing: { glow: '#8B5CF6', core: '#EDE9FE', nebula: '#7C3AED' }, // Violet (Deep Thought)
  thinking: { glow: '#6366F1', core: '#E0E7FF', nebula: '#4F46E5' }, // Indigo
  speaking: ORB_COLORS.neutral, 
  fallback: ORB_COLORS.concerned
};

// --- PHYSICS ORB COMPONENT ---
interface RealisticOrbProps {
    state: SystemState;
    emotion: OrbEmotion;
    onClick?: () => void;
}

const RealisticOrb: React.FC<RealisticOrbProps> = ({ state, emotion, onClick }) => {
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing' || state === 'thinking';
  const isListening = state === 'listening';
  const isFallback = state === 'fallback';
  
  // Dynamic Palette Resolution
  const palette = (isListening || isProcessing || isFallback) 
      ? STATE_COLORS[state] 
      : ORB_COLORS[emotion];

  return (
    <motion.div 
        className="relative flex items-center justify-center cursor-pointer select-none"
        style={{ width: 120, height: 120 }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
      {/* 1. OUTER AURA (Breathing Glow) */}
      <motion.div 
        animate={{ 
            opacity: isProcessing ? 0.5 : isListening ? 0.6 : 0.3,
            scale: isProcessing ? 1.6 : isListening ? 1.4 : 1.2,
            backgroundColor: palette.glow,
        }}
        transition={{ 
            duration: isProcessing ? 1.5 : 4, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
        }}
        className="absolute inset-0 rounded-full blur-[40px] transition-colors duration-500"
      />

      {/* 2. GYROSCOPIC RINGS (Thinking State Only) */}
      <div className="absolute inset-[-40px] z-0 pointer-events-none" style={{ perspective: '800px' }}>
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full relative"
              >
                <motion.div
                  animate={{ rotateX: [0, 360], rotateZ: [0, 180] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-[1px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
                />
                <motion.div
                  animate={{ rotateY: [0, 360], rotateZ: [90, 270] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-[1px] border-white/30"
                  style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                />
                <motion.div
                  animate={{ rotateX: [360, 0], rotateY: [360, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border-[1px] border-white/20 border-dotted"
                />
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* 3. CORE ORB (The Eye/Brain) */}
      <motion.div 
        className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
        style={{
            background: `radial-gradient(circle at 30% 30%, ${palette.core}, #000)`,
            boxShadow: `0 0 20px ${palette.glow}40, inset 0 0 20px ${palette.glow}40`
        }}
        animate={{
            scale: isSpeaking ? [1, 1.05, 1] : isProcessing ? 0.85 : 1, // Significant constriction on thought (focus)
            borderColor: isProcessing ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)"
        }}
        transition={{
            scale: { type: "spring", stiffness: 300, damping: 20 },
            borderColor: { duration: 0.3 }
        }}
      >
          <motion.div
            className="absolute inset-[-100%]"
            style={{
                background: `conic-gradient(from 0deg, transparent, ${palette.nebula}, transparent, ${palette.glow}, transparent)`,
                filter: 'blur(30px)',
                opacity: 0.9
            }}
            animate={{ 
                rotate: 360,
                scale: isProcessing ? [1, 1.2, 1] : 1
            }}
            transition={{ 
                rotate: { duration: isProcessing ? 0.8 : 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, repeatType: "mirror" }
            }}
          />

          <AnimatePresence>
            {isProcessing && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.1, ease: "easeInOut" }}
                    className="absolute inset-0 bg-indigo-500 mix-blend-color-dodge"
                />
            )}
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
          
          <motion.div 
            animate={{ opacity: isProcessing ? 0.4 : 0.8 }}
            className="absolute top-[20%] left-[25%] w-[15%] h-[10%] bg-white blur-[4px] rounded-[100%]" 
          />
      </motion.div>
      
      <div className="absolute inset-0 rounded-full ring-1 ring-white/10 z-20 pointer-events-none"></div>
    </motion.div>
  );
};

// --- ACTION PANELS ---
interface ActionPanelProps { onAction: (path: string) => void; isLocked: boolean; }

const PathDecisionCard: React.FC<ActionPanelProps> = ({ onAction, isLocked }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20, scale: 0.95 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 20, scale: 0.95 }}
    className="bg-dark-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl w-[280px] origin-bottom-right"
  >
    <div className="flex items-center gap-3 mb-3">
       <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldCheck size={18} /></div>
       <div>
         <h3 className="text-white font-bold text-sm">Recommended Path</h3>
         <p className="text-[10px] uppercase tracking-wider text-gray-500">AI Analysis Complete</p>
       </div>
    </div>
    <div className="space-y-2">
      <button 
        onClick={() => onAction('activate')}
        disabled={isLocked}
        className="w-full bg-primary text-dark-900 font-bold py-2 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-xs shadow-lg disabled:opacity-50"
      >
        {isLocked ? <Loader2 className="animate-spin" size={14} /> : "Activate Revenue Engine"}
      </button>
      <button 
        onClick={() => onAction('book_call')}
        disabled={isLocked}
        className="w-full bg-white/5 text-gray-300 font-medium py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all border border-white/5 text-xs disabled:opacity-50"
      >
        Book Strategy Call Instead
      </button>
    </div>
  </motion.div>
);

const BookingCard: React.FC<{ onBook: () => void; isLocked: boolean }> = ({ onBook, isLocked }) => (
    <motion.div 
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="bg-dark-900/95 backdrop-blur-xl border border-primary/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(0,217,255,0.1)] w-[280px] origin-bottom-right"
    >
      <div className="text-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg ring-2 ring-dark-900">
           <Calendar className="text-white" size={18} />
        </div>
        <h3 className="text-white font-bold text-sm">Strategy Session Ready</h3>
        <p className="text-[10px] text-gray-400 mt-1">Priority slot reserved for 15 minutes.</p>
      </div>
      <button 
        onClick={onBook}
        disabled={isLocked}
        className="w-full bg-primary text-dark-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-sm"
      >
        {isLocked ? <Loader2 className="animate-spin" size={16} /> : (
            <><span>Secure Booking</span><ExternalLink size={14} /></>
        )}
      </button>
    </motion.div>
);

const WaitingCard: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-dark-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-[240px] flex items-center gap-3 origin-bottom-right"
    >
      <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
      </div>
      <div>
         <h4 className="text-white font-bold text-sm">Activation in progress</h4>
         <p className="text-[10px] text-gray-400">Securing your instance...</p>
      </div>
    </motion.div>
);

// --- MAIN CONTROLLER ---
export const AgentHUD: React.FC = () => {
  const { 
    systemState, 
    orbEmotion,
    atlasState, 
    chatHistory,
    isHistoryOpen,
    isAudioPlaying,
    isLocked,
    lastEvent, 
    toggleHistory,
    handleInteraction,
    retryLastInteraction, 
    addChatMessage,
    setSystemState,
    interruptAudio
  } = useSystemStore();

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState<ChatMessage[]>([]);
  const lastProcessedId = useRef<string | null>(null);
  
  // AssemblyAI Client Ref
  const assemblyClientRef = useRef<AssemblyAIClient | null>(null);

  useEffect(() => {
      // Cleanup on unmount
      return () => {
          assemblyClientRef.current?.stop();
      };
  }, []);

  // --- CONTEXT AWARE THINKING TEXT ---
  const thinkingText = useMemo(() => {
    if (!lastEvent) return "Processing...";
    const { event, payload } = lastEvent;

    if (event === 'init') return "Initializing Core...";
    if (event === 'user_message') return "Analyzing Intent...";
    
    if (event === 'cta_clicked') {
      if (payload?.source === 'navbar') return "Checking Availability...";
      if (payload?.source === 'hero_primary') return "Analyzing Infrastructure...";
      if (payload?.source === 'pricing') return "Calculating Specs...";
      if (payload?.source === 'final_cta') return "Securing Slot...";
    }

    if (event === 'path_selected') {
        if (payload?.path === 'book_call') return "Generating Link...";
        if (payload?.path === 'activate') return "Initiating Activation...";
    }

    return "Thinking...";
  }, [lastEvent]);

  // --- TRANSCRIPT MANAGER ---
  useEffect(() => {
    if (chatHistory.length === 0) return;
    
    const latestMsg = chatHistory[chatHistory.length - 1];
    if (latestMsg.id === lastProcessedId.current) return;
    
    const isRecent = Date.now() - latestMsg.timestamp < 1000;
    
    if (isRecent) {
        lastProcessedId.current = latestMsg.id;
        setTranscripts(prev => [...prev.slice(-2), latestMsg]); 

        setTimeout(() => {
            setTranscripts(prev => prev.filter(t => t.id !== latestMsg.id));
        }, 6000); 
    }
  }, [chatHistory]);

  const toggleVoice = async () => {
    if (isListening) {
        assemblyClientRef.current?.stop();
        setIsListening(false);
        setSystemState('idle');
    } else {
        if (isAudioPlaying) interruptAudio();

        if (!assemblyClientRef.current) {
            assemblyClientRef.current = new AssemblyAIClient(
                (text, isFinal) => {
                    if (isFinal && text.trim()) {
                        addChatMessage('user', text);
                        handleInteraction('user_message', { text });
                        // We keep the mic open for speech-to-speech continuity
                    }
                }
            );
        }
        
        setIsListening(true);
        setSystemState('listening');
        
        try {
            await assemblyClientRef.current.start();
        } catch (e) {
            console.error("Mic error", e);
            setIsListening(false);
            setSystemState('idle');
            alert("Could not access microphone. Please check permissions.");
        }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (isAudioPlaying) interruptAudio();
    addChatMessage('user', inputText);
    handleInteraction('user_message', { text: inputText });
    setInputText('');
  };

  const handleOrbClick = () => {
      toggleHistory(!isHistoryOpen);
      if (systemState === 'idle' && chatHistory.length === 0) {
          handleInteraction('init');
      }
      if (isAudioPlaying) interruptAudio();
  };

  // --- LAYOUT ---
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-row items-end justify-end gap-4 md:gap-6 pointer-events-none w-full max-w-[100vw] overflow-hidden">
        
        {/* --- LEFT COLUMN: Context Panels (Stacked) --- */}
        <div className="pointer-events-auto flex flex-col items-end gap-4 pb-12 md:pb-10 shrink-0">
            <AnimatePresence mode="popLayout">
                {atlasState.ui_action === 'show_paths' && <PathDecisionCard key="paths" onAction={(p) => handleInteraction('path_selected', { path: p })} isLocked={isLocked} />}
                {atlasState.ui_action === 'show_booking' && <BookingCard key="booking" onBook={() => window.open(atlasState.data.booking_link || '', '_blank')} isLocked={isLocked} />}
                {atlasState.ui_action === 'show_waiting_state' && <WaitingCard key="waiting" />}
            </AnimatePresence>
        </div>

        {/* --- RIGHT COLUMN: Agent Interface --- */}
        <div className="flex flex-col items-center justify-end relative pb-2 md:mr-4 shrink-0 min-w-[280px]">
            
            {/* 1. TRANSCRIPTS (Stack Upwards) */}
            <div className="flex flex-col items-center justify-end gap-3 mb-4 w-full min-h-[120px] pointer-events-none z-10">
                <AnimatePresence mode="popLayout">
                    {transcripts.map((msg) => (
                         <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.6 }}
                            layout
                            className={`max-w-[280px] p-4 rounded-2xl backdrop-blur-xl border shadow-2xl text-sm font-medium leading-relaxed ${
                                msg.role === 'agent'
                                    ? 'bg-dark-900/90 border-white/20 text-white rounded-bl-sm origin-bottom-left'
                                    : 'bg-primary/10 border-primary/20 text-primary-50 rounded-br-sm origin-bottom-right text-right self-end'
                            }`}
                        >
                            {msg.role === 'agent' && (
                                <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-dark-900/90 border-r border-b border-white/20 rotate-45"></div>
                            )}
                            "{msg.text}"
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 2. ORB (Clickable) */}
            <div className="relative z-20 transition-transform duration-500 hover:scale-105 active:scale-95 group pointer-events-auto">
                 <RealisticOrb state={systemState} emotion={orbEmotion} onClick={handleOrbClick} />
                 
                 {/* Thinking Badge */}
                 <AnimatePresence>
                   {(systemState === 'processing' || systemState === 'thinking') && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 5 }}
                         className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] font-bold tracking-[0.15em] text-primary uppercase whitespace-nowrap bg-dark-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30 shadow-[0_0_20px_rgba(0,217,255,0.15)] z-50"
                       >
                           <BrainCircuit size={12} className="animate-pulse" />
                           <span className="bg-gradient-to-r from-primary to-white bg-clip-text text-transparent animate-pulse">
                              {thinkingText}
                           </span>
                       </motion.div>
                   )}
                 </AnimatePresence>

                 {/* Error Badge */}
                 {systemState === 'fallback' && (
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] text-red-500 uppercase whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                         <AlertTriangle size={10} />
                         Offline
                     </div>
                 )}
            </div>

            {/* 3. INPUT (Clickable) */}
            <div className="relative z-30 mt-[-25px] w-[260px] md:w-[280px] pointer-events-auto">
                {systemState === 'fallback' ? (
                     <button 
                        onClick={() => retryLastInteraction()}
                        className="w-full bg-red-500/10 border border-red-500/50 backdrop-blur-xl text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-full p-2 flex items-center justify-center gap-2 text-xs font-bold shadow-lg"
                     >
                        <RefreshCw size={14} />
                        Retry Request
                     </button>
                ) : (
                    <div className="transition-all duration-300 opacity-90 hover:opacity-100 focus-within:opacity-100">
                        <div className="bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 flex items-center gap-2 shadow-2xl ring-1 ring-white/5 transition-all focus-within:ring-primary/40 focus-within:bg-[#0A1628] focus-within:scale-[1.02]">
                            <button 
                                onClick={toggleVoice}
                                className={`p-2 rounded-full transition-all flex-shrink-0 ${
                                    isListening 
                                        ? 'bg-red-500 text-white animate-pulse' 
                                        : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                            >
                                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                            </button>
                            <form onSubmit={handleSend} className="flex-1 min-w-0">
                                <input 
                                    type="text" 
                                    value={inputText} 
                                    onChange={(e) => setInputText(e.target.value)} 
                                    placeholder="Ask Atlas..."
                                    className="w-full bg-transparent border-none text-xs md:text-sm text-white placeholder:text-gray-500 h-8 px-2 focus:outline-none font-medium" 
                                />
                            </form>
                            <button 
                                onClick={handleSend}
                                disabled={!inputText}
                                className="p-2 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-dark-900 transition-all disabled:opacity-0 disabled:scale-50"
                            >
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
        </div>

        {/* 4. HISTORY LOG (Toggled by Orb) */}
        <AnimatePresence>
            {isHistoryOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    className="fixed bottom-24 right-4 md:right-8 w-[340px] h-[400px] bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-[60]"
                >
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                        <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                            <Terminal size={14} />
                            <span>ATLAS_SYS_LOG</span>
                        </div>
                        <button onClick={() => toggleHistory(false)}><X size={16} className="text-gray-500 hover:text-white" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {chatHistory.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-primary/10 text-white border border-primary/10' 
                                        : 'bg-white/5 text-gray-300'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[9px] text-gray-600 mt-1 uppercase tracking-wider">{msg.role}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
