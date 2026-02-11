import { create } from 'zustand';
import { AgentService } from '../services/agentService';

export type SystemState = 'idle' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'fallback';

export type OrbEmotion = 'neutral' | 'curious' | 'attentive' | 'confident' | 'inviting' | 'celebratory' | 'concerned';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
  visible: boolean;
}

// STRICT JSON PROTOCOL FROM DOCUMENTATION
export type AtlasStage = 
  | 'intro' 
  | 'qualify' 
  | 'recommend' 
  | 'show_paths' 
  | 'waiting_payment' 
  | 'booked_call' 
  | 'onboarding_ready'
  | 'connection_error';

export type AtlasUIAction = 
  | 'none' 
  | 'show_paths' 
  | 'show_booking' 
  | 'show_waiting_state' 
  | 'redirect_dashboard'
  | 'lock_ui';

export interface AtlasData {
  recommended_tier: string | null;
  booking_link: string | null;
  dashboard_url: string | null;
}

export interface AtlasState {
  stage: AtlasStage;
  ui_action: AtlasUIAction;
  data: AtlasData;
  last_spoken: string | null;
}

interface SystemStore {
  // Core State
  sessionId: string;
  startTime: number; 
  systemState: SystemState;
  orbEmotion: OrbEmotion;
  isLocked: boolean; // Debounce lock
  
  // Data
  transcript: string;
  chatHistory: ChatMessage[];
  lastEvent: { event: string; payload?: any } | null; // For Retry Mechanism
  
  // Atlas Specifics (The State Machine)
  atlasState: AtlasState;
  
  // UI Flags
  isMicActive: boolean;
  isHudOpen: boolean;
  isHistoryOpen: boolean;
  isAudioPlaying: boolean;

  // Actions
  setSystemState: (state: SystemState) => void;
  setOrbEmotion: (emotion: OrbEmotion) => void;
  setTranscript: (text: string) => void;
  addChatMessage: (role: 'user' | 'agent', text: string) => void;
  toggleHud: (isOpen: boolean) => void;
  toggleHistory: (isOpen: boolean) => void;
  setIsAudioPlaying: (isPlaying: boolean) => void;
  
  // Interaction Handling
  handleInteraction: (event: string, data?: any) => Promise<void>;
  retryLastInteraction: () => void;
  interruptAudio: () => void;
}

const generateSessionId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'sess-' + Math.random().toString(36).substring(2, 15);
};

// Emotion Mapper based on STAGE
const mapStageToEmotion = (stage: AtlasStage): OrbEmotion => {
    switch (stage) {
        case 'intro': return 'curious';
        case 'qualify': return 'attentive';
        case 'recommend': return 'confident';
        case 'show_paths': return 'inviting';
        case 'waiting_payment': return 'neutral';
        case 'booked_call': return 'celebratory';
        case 'connection_error': return 'concerned';
        default: return 'neutral';
    }
};

const DEFAULT_ATLAS_DATA: AtlasData = {
    recommended_tier: null,
    booking_link: null,
    dashboard_url: null
};

export const useSystemStore = create<SystemStore>((set, get) => ({
  sessionId: '',
  startTime: Date.now(),
  systemState: 'idle',
  orbEmotion: 'neutral',
  isLocked: false,
  
  transcript: '',
  chatHistory: [],
  lastEvent: null,
  
  atlasState: {
    stage: 'intro',
    ui_action: 'none',
    data: DEFAULT_ATLAS_DATA,
    last_spoken: null
  },
  
  isMicActive: false,
  isHudOpen: true,
  isHistoryOpen: false,
  isAudioPlaying: false,

  setSystemState: (state) => set({ systemState: state }),
  setOrbEmotion: (emotion) => set({ orbEmotion: emotion }),
  setTranscript: (text) => set({ transcript: text }),
  toggleHud: (isOpen) => set({ isHudOpen: isOpen }),
  toggleHistory: (isOpen) => set({ isHistoryOpen: isOpen }),
  setIsAudioPlaying: (isPlaying) => set({ 
      isAudioPlaying: isPlaying, 
      systemState: isPlaying ? 'speaking' : 'idle' 
  }),
  
  addChatMessage: (role, text) => set((state) => ({
    chatHistory: [
      ...state.chatHistory,
      {
        id: crypto.randomUUID(),
        role,
        text,
        timestamp: Date.now(),
        visible: true
      }
    ]
  })),

  interruptAudio: () => {
    AgentService.stopAudio();
    set({ isAudioPlaying: false, systemState: 'idle' });
  },

  retryLastInteraction: () => {
      const { lastEvent, handleInteraction } = get();
      if (lastEvent) {
          console.log('[ATLAS] Retrying last interaction:', lastEvent);
          handleInteraction(lastEvent.event, lastEvent.payload);
      } else {
          // If no history, just reset to idle
          set({ systemState: 'idle', orbEmotion: 'neutral' });
      }
  },

  handleInteraction: async (event: string, payload?: any) => {
    const store = get();
    
    // 1. Anti-Rage Click / Debounce (Allow 'interrupt' to pass through)
    if (store.isLocked && event !== 'interrupt') {
        console.log('[ATLAS] Interaction blocked by lock');
        return;
    }

    // Save for retry mechanism
    set({ lastEvent: { event, payload } });

    // Initialize session if needed
    if (!store.sessionId) {
        set({ sessionId: generateSessionId() });
    }

    // Interrupt existing audio for new interactions
    if (store.isAudioPlaying) {
        AgentService.stopAudio();
    }
    
    // 2. IMMEDIATE FEEDBACK LAYER (0ms)
    // Lock UI, set processing state to show user "I heard you"
    set({ isLocked: true, systemState: 'processing', isHudOpen: true });

    console.log(`[ATLAS] Action: ${event}`, payload);

    // 3. FAILSAFE TIMER
    // Extended to 60s to allow for cold starts/long LLM generations
    const fallbackTimer = setTimeout(() => {
        const currentState = get().systemState;
        if (currentState === 'processing') {
            console.warn('[ATLAS] Failsafe triggered: Request timed out');
            set({ 
                systemState: 'fallback', 
                orbEmotion: 'concerned',
                isLocked: false
            });
        }
    }, 60000); 

    try {
      // 4. API CALL
      const response = await AgentService.processEvent(event, payload);
      
      clearTimeout(fallbackTimer);
      
      if (response) {
        // 5. UPDATE STATE FROM INTELLIGENCE
        const emotion = mapStageToEmotion(response.stage as AtlasStage);
        
        // SAFE DATA ASSIGNMENT (Fixes "undefined" error)
        const safeData: AtlasData = {
            recommended_tier: response.data?.recommended_tier || null,
            booking_link: response.data?.booking_link || null,
            dashboard_url: response.data?.dashboard_url || null
        };

        // Message First, UI Second is handled by components reading this state
        set({ 
          atlasState: {
            stage: response.stage as AtlasStage,
            ui_action: response.ui_action as AtlasUIAction,
            data: safeData,
            last_spoken: response.spoken_response || null
          },
          orbEmotion: emotion,
          isLocked: false 
        });

        // Add to history (internal log)
        if (response.spoken_response && response.spoken_response.trim() !== "") {
            store.addChatMessage('agent', response.spoken_response);
        }
        
        // Audio state is handled by AgentService calling setIsAudioPlaying
      } else {
          throw new Error('Empty response');
      }
    } catch (e) {
      clearTimeout(fallbackTimer);
      console.error('[ATLAS] Error:', e);
      set({ 
          systemState: 'fallback', 
          orbEmotion: 'concerned', 
          isLocked: false 
      });
    }
  }
}));