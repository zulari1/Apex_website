import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSystemStore, OrbEmotion, SystemState, ChatMessage } from '../store/useSystemStore';
import { ArrowRight, Mic, MicOff, ShieldCheck, BrainCircuit, Calendar, Loader2, Lock, X, Terminal } from 'lucide-react';
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
  processing: { glow: '#8B5CF6', core: '#EDE9FE', nebula: '#7C3AED' }, // Violet
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
  const isProcessing = state === 'processing' || state === 'thinking';
  const isListening = state === 'listening';
  const isFallback = state === 'fallback';
  const isSpeaking = state === 'speaking';
  
  const palette = (isListening || isProcessing || isFallback) 
      ? STATE_COLORS[state] 
      : ORB_COLORS[emotion];

  return (
    <motion.div 
        className="relative flex items-center justify-center cursor-pointer select-none"
        style={{ width: 100, height: 100 }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
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

      <motion.div 
        className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] border border-white/10"
        style={{
            background: `radial-gradient(circle at 30% 30%, ${palette.core}, #000)`,
            boxShadow: `0 0 20px ${palette.glow}40, inset 0 0 20px ${palette.glow}40`
        }}
        animate={{
            scale: isSpeaking ? [1, 1.05, 1] : isProcessing ? 0.9 : 1, 
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
                filter: 'blur(25px)',
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
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </motion.div>
    </motion.div>
  );
};

// --- ACTION PANELS (UI State Machine Views) ---

const PathDecisionPanel: React.FC<{ onAction: (path: string) => void; isLocked: boolean; recommendedTier: string | null }> = ({ onAction, isLocked, recommendedTier }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    className="bg-dark-900/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-2xl w-[300px] mb-2 pointer-events-auto"
  >
    <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
       <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldCheck size={18} /></div>
       <div>
         <h3 className="text-white font-bold text-sm">Revenue Strategy</h3>
         <p className="text-[10px] uppercase tracking-wider text-gray-400">Analysis Complete</p>
       </div>
    </div>
    <div className="space-y-2">
        {recommendedTier && (
            <div className="mb-3 bg-primary/5 border border-primary/20 rounded-lg p-2.5">
                <p className="text-[10px] text-primary font-medium mb-0.5 uppercase tracking-wide">Recommendation</p>
                <p className="text-white font-bold text-sm">{recommendedTier}</p>
            </div>
        )}
      <button onClick={() => onAction('activate')} disabled={isLocked} className="w-full bg-primary text-dark-900 font-bold py-2.5 rounded-lg text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        {isLocked ? <Loader2 className="animate-spin" size={14} /> : "Activate This Plan"}
      </button>
      <button onClick={() => onAction('book_call')} disabled={isLocked} className="w-full bg-white/5 text-gray-300 font-medium py-2.5 rounded-lg border border-white/5 text-xs hover:bg-white/10 transition-colors">
         Book Strategy Call Instead
      </button>
    </div>
  </motion.div>
);

const BookingPanel: React.FC<{ link: string; isLocked: boolean }> = ({ link, isLocked }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="bg-dark-900/95 backdrop-blur-2xl border border-success/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(0,245,160,0.1)] w-[300px] mb-2 pointer-events-auto overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-success"></div>
      <div className="text-center mb-4 pt-2">
        <h3 className="text-white font-bold text-base">Strategy Session Ready</h3>
        <p className="text-gray-400 text-xs mt-1">Slot reserved for 10 minutes</p>
      </div>
      <button onClick={() => window.open(link, '_blank')} disabled={isLocked} className="w-full bg-success text-dark-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:brightness-110 transition-all">
        <span>Book Meeting With Atlas</span>
        <ArrowRight size={16} />
      </button>
    </motion.div>
);

const WaitingPanel: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="bg-dark-900/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-2xl w-[300px] mb-2 pointer-events-auto"
    >
       <div className="flex items-center gap-4">
          <div className="relative shrink-0">
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                <Lock size={18} className="text-primary" />
             </div>
             <div className="absolute -bottom-1 -right-1 bg-dark-900 rounded-full p-0.5">
                <Loader2 size={12} className="text-primary animate-spin" />
             </div>
          </div>
          <div>
              <h3 className="text-white font-bold text-sm mb-1">Securing Slot...</h3>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                  Please check your email for the secure activation link.
              </p>
          </div>
       </div>
    </motion.div>
);

// --- HISTORY PANEL ---
const HistoryPanel: React.FC<{ history: ChatMessage[]; onClose: () => void }> = ({ history, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="absolute bottom-32 right-0 w-[320px] h-[400px] bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-[60]"
    >
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20">
            <span className="text-gray-400 font-mono text-xs flex items-center gap-2"><Terminal size={12} /> ATLAS_SYS_LOG</span>
            <button onClick={onClose}><X size={14} className="text-gray-500 hover:text-white" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {history.length === 0 && (
                <div className="text-center text-gray-600 text-xs mt-10">System initialized. No logs yet.</div>
            )}
            {history.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary/10 text-white border border-primary/20' : 'bg-white/5 text-gray-300 border border-white/5'}`}>
                        {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            ))}
        </div>
    </motion.div>
);

// --- FLOATING TRANSCRIPT BUBBLE ---
const TranscriptBubble: React.FC<{ text: string }> = ({ text }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="max-w-[280px] self-end mb-2"
    >
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl rounded-br-sm shadow-xl relative">
            <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                {text}
            </p>
        </div>
    </motion.div>
);

// --- MAIN CONTROLLER ---
export const AgentHUD: React.FC = () => {
  const { systemState, orbEmotion, atlasState, chatHistory, isHistoryOpen, isAudioPlaying, isLocked, lastEvent, handleInteraction, addChatMessage, setSystemState, interruptAudio, toggleHistory } = useSystemStore();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const assemblyClientRef = useRef<AssemblyAIClient | null>(null);

  // Filter recent agent messages (Last 6 seconds) for floating captions
  // This implements "Non-Blocking Intelligence" - messages appear and fade
  const recentMessages = useMemo(() => {
    const now = Date.now();
    // Only show agent messages that are less than 6 seconds old
    return chatHistory
        .filter(m => m.role === 'agent' && (now - m.timestamp) < 6000)
        .slice(-2); // Max 2 messages to strictly limit screen real estate (<20%)
  }, [chatHistory, systemState]);

  const thinkingText = useMemo(() => {
    if (!lastEvent) return "Processing...";
    if (lastEvent.event === 'init') return "Initializing Core...";
    return "Thinking...";
  }, [lastEvent]);

  // Handle Voice Input
  const toggleVoice = async () => {
    if (isListening) {
        assemblyClientRef.current?.stop();
        setIsListening(false);
        setSystemState('idle');
    } else {
        if (isAudioPlaying) interruptAudio();
        if (!assemblyClientRef.current) {
            assemblyClientRef.current = new AssemblyAIClient(
                (text, isFinal) => { if (isFinal && text.trim()) { addChatMessage('user', text); handleInteraction('user_message', { text }); } }
            );
        }
        setIsListening(true);
        setSystemState('listening');
        try { await assemblyClientRef.current.start(); } 
        catch (e) { setIsListening(false); setSystemState('idle'); alert("Could not access microphone."); }
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
      // Toggle History Logic (Scrollable only when user taps orb)
      toggleHistory(!isHistoryOpen);
      
      // If idle and first click, maybe init? (User preference)
      if (systemState === 'idle' && chatHistory.length === 0) handleInteraction('init');
      
      if (isAudioPlaying) interruptAudio();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none w-full max-w-[400px]">
        
        {/* 1. HISTORY PANEL (Absolute Positioned, independent of stack) */}
        <AnimatePresence>
            {isHistoryOpen && <HistoryPanel history={chatHistory} onClose={() => toggleHistory(false)} />}
        </AnimatePresence>

        {/* 2. MAIN FLEX STACK (Panels -> Transcripts -> Orb) */}
        {/* Flex-col-reverse or Justify-end ensures elements grow upwards from bottom */}
        <div className="flex flex-col items-end w-full">
            
            {/* A. ACTION PANELS (Top of local stack, z-index high) */}
            <div className="w-full flex flex-col items-end pr-2">
                <AnimatePresence mode="wait">
                    {atlasState.ui_action === 'show_paths' && (
                        <PathDecisionPanel 
                            key="paths" 
                            onAction={(p) => handleInteraction('path_selected', { path: p })} 
                            isLocked={isLocked} 
                            recommendedTier={atlasState.data.recommended_tier}
                        />
                    )}
                    {atlasState.ui_action === 'show_booking' && (
                        <BookingPanel key="booking" link={atlasState.data.booking_link || ''} isLocked={isLocked} />
                    )}
                    {atlasState.ui_action === 'show_waiting_state' && (
                        <WaitingPanel key="waiting" />
                    )}
                </AnimatePresence>
            </div>

            {/* B. FLOATING TRANSCRIPTS (Middle of stack) */}
            {/* These will push the panels UP if present, preventing overlap */}
            <div className="w-full flex flex-col items-end pr-4 min-h-[20px]">
                <AnimatePresence>
                    {recentMessages.map(msg => (
                        <TranscriptBubble key={msg.id} text={msg.text} />
                    ))}
                </AnimatePresence>
            </div>

            {/* C. AGENT INTERFACE (Bottom of stack) */}
            <div className="flex items-end gap-3 pointer-events-auto pr-2 pb-2 mt-2">
                 {/* INPUT */}
                 <div className="relative z-30 mb-6 hidden md:block">
                     <div className="bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl ring-1 ring-white/5 transition-all focus-within:ring-primary/40 focus-within:bg-[#0A1628] w-[260px]">
                        <button onClick={toggleVoice} className={`p-2 rounded-full transition-all flex-shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                        </button>
                        <form onSubmit={handleSend} className="flex-1 min-w-0">
                            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask Atlas..." className="w-full bg-transparent border-none text-sm text-white placeholder:text-gray-500 h-8 px-1 focus:outline-none" />
                        </form>
                        <button onClick={handleSend} disabled={!inputText} className="p-2 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-dark-900 transition-all disabled:opacity-0 disabled:scale-50">
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                 {/* ORB */}
                 <div className="relative z-20 group">
                     <RealisticOrb state={systemState} emotion={orbEmotion} onClick={handleOrbClick} />
                     <AnimatePresence>
                       {(systemState === 'processing' || systemState === 'thinking') && (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9px] font-bold tracking-wider text-primary uppercase bg-dark-900/90 px-2 py-1 rounded-full border border-primary/30 whitespace-nowrap shadow-lg">
                               <BrainCircuit size={10} className="animate-pulse" /> {thinkingText}
                           </motion.div>
                       )}
                     </AnimatePresence>
                </div>
            </div>
        </div>
    </div>
  );
};