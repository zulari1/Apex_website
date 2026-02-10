
import { useSystemStore } from '../store/useSystemStore';

/**
 * --- ATLAS EVENT DOCUMENTATION (FOR BACKEND TRAINING) ---
 * 
 * Train your n8n/LLM backend to switch logic based on `event_type`.
 * 
 * 1. SESSION_INIT
 *    - User Intent: "System initiated. Awaiting directive."
 *    - Context: Sent on page load.
 * 
 * 2. USER_MESSAGE
 *    - User Intent: {Dynamic User Input}
 *    - Context: Standard chat/voice interaction.
 * 
 * 3. INTENT_BOOK_GENERAL
 *    - User Intent: "I want to schedule a demo immediately."
 *    - Trigger: Navbar or Mobile Menu "Book Demo" button.
 * 
 * 4. INTENT_REPLACE_SDR
 *    - User Intent: "I want to replace my SDR team with AI. How do we start?"
 *    - Trigger: Hero Section "Replace Your SDR Team" button.
 * 
 * 5. INTENT_SELECT_TIER
 *    - User Intent: "I am interested in the {Tier Name} plan. What is the deployment process?"
 *    - Trigger: Pricing Card buttons. Metadata includes `tier`.
 * 
 * 6. INTENT_SCARCITY_BOOKING
 *    - User Intent: "I want to secure one of the remaining slots for this month."
 *    - Trigger: Final/Footer CTA.
 * 
 * 7. INTENT_HUD_ACTION
 *    - User Intent: "I have selected the path: '{Path Name}'. Proceed with next steps."
 *    - Trigger: Buttons inside the Agent HUD (Book Call / Activate).
 */

const ATLAS_WEBHOOK = 'https://apex-dev.app.n8n.cloud/webhook/atlas';

interface AtlasOutput {
  agent: 'atlas';
  stage: string;
  ui_action: string;
  spoken_response: string;
  data: {
    recommended_tier: string | null;
    booking_link: string | null;
    dashboard_url: string | null;
  };
}

interface AtlasPayload {
  session_id: string;
  event_type: string;     
  user_intent: string;    
  user_message_raw?: string;
  time_on_page: number;
  metadata: any;
}

let currentAudio: HTMLAudioElement | null = null;

export const AgentService = {
  stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
        useSystemStore.getState().setIsAudioPlaying(false);
    }
  },

  /**
   * Translates a raw UI event into a structured Atlas Payload
   */
  translateEvent(event: string, payload?: any): Partial<AtlasPayload> {
    
    // 1. CTA CLICKS (Routing Logic)
    if (event === 'cta_clicked') {
        const source = payload?.source;
        
        if (source === 'navbar' || source === 'navbar_mobile') {
            return {
                event_type: 'INTENT_BOOK_GENERAL',
                user_intent: "I want to schedule a demo immediately.",
                metadata: { source }
            };
        }
        
        if (source === 'hero_primary') {
            return {
                event_type: 'INTENT_REPLACE_SDR',
                user_intent: "I want to replace my SDR team with AI. How do we start?",
                metadata: { source }
            };
        }

        if (source === 'pricing') {
            const tier = payload?.tier || 'Unknown Tier';
            return {
                event_type: 'INTENT_SELECT_TIER',
                user_intent: `I am interested in the ${tier} plan. What is the deployment process?`,
                metadata: { source, tier }
            };
        }

        if (source === 'final_cta') {
            return {
                event_type: 'INTENT_SCARCITY_BOOKING',
                user_intent: "I want to secure one of the remaining slots for this month.",
                metadata: { source }
            };
        }
    }

    // 2. HUD INTERACTIONS
    if (event === 'path_selected') {
        const pathId = payload?.path;
        let humanPath = pathId;
        
        // Map internal IDs to Natural Language for LLM
        if (pathId === 'book_call') humanPath = "Book Strategy Call";
        if (pathId === 'activate') humanPath = "Activate Revenue Engine";

        return {
            event_type: 'INTENT_HUD_ACTION',
            user_intent: `I have selected the path: "${humanPath}". Proceed with next steps.`,
            metadata: { path: pathId, path_human: humanPath }
        };
    }

    // 3. CHAT MESSAGES
    if (event === 'user_message') {
        return {
            event_type: 'USER_MESSAGE',
            user_intent: payload?.text || "", 
            user_message_raw: payload?.text,
            metadata: {}
        };
    }

    // 4. INITIALIZATION
    if (event === 'init') {
        return {
            event_type: 'SESSION_INIT',
            user_intent: "System initiated. Awaiting directive.",
            metadata: {}
        };
    }

    // Fallback
    return {
        event_type: 'UNKNOWN_EVENT',
        user_intent: "User interaction detected.",
        metadata: { original_event: event, payload }
    };
  },

  async processEvent(event: string, payload?: any): Promise<AtlasOutput | null> {
    const store = useSystemStore.getState();
    const sessionId = store.sessionId || 'demo_session';
    const timeOnPage = Math.floor((Date.now() - store.startTime) / 1000);
    
    // Translate the raw UI event into LLM-ready context
    const translatedContext = this.translateEvent(event, payload);

    const requestPayload: AtlasPayload = {
      session_id: sessionId,
      time_on_page: timeOnPage,
      event_type: translatedContext.event_type || 'UNKNOWN',
      user_intent: translatedContext.user_intent || '',
      user_message_raw: translatedContext.user_message_raw,
      metadata: translatedContext.metadata
    };

    console.log('[ATLAS SERVICE] Transmitting Neural Packet:', requestPayload);

    try {
      // 1. Attempt Real Webhook with extended timeout (12s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); 

      const response = await fetch(ATLAS_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
          signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
          throw new Error(`Webhook Error: ${response.status}`);
      }

      const rawData = await response.json();
      const dataItem = Array.isArray(rawData) ? rawData[0] : rawData;
      
      if (dataItem && dataItem.output) {
          if (dataItem.audioBase64) {
              this.playAudio(dataItem.audioBase64);
          }
          return dataItem.output as AtlasOutput;
      } else {
           throw new Error("Invalid response format");
      }

    } catch (error) {
      console.warn('[ATLAS SERVICE] Network/Webhook failed.', error);
      
      // FALLBACK: Return UI Error State ONLY. 
      // Do NOT return a 'spoken_response' to avoid fake chat messages.
      return {
          agent: 'atlas',
          stage: 'connection_error',
          ui_action: 'none',
          spoken_response: "", // Empty string to suppress "Unable to connect" chat bubble
          data: { recommended_tier: null, booking_link: null, dashboard_url: null }
      };
    }
  },

  playAudio(base64String: string) {
      try {
          this.stopAudio();
          const audioUrl = `data:audio/wav;base64,${base64String}`;
          currentAudio = new Audio(audioUrl);
          
          currentAudio.onplay = () => {
              useSystemStore.getState().setIsAudioPlaying(true);
              useSystemStore.getState().setSystemState('speaking');
          };
          
          currentAudio.onended = () => {
              useSystemStore.getState().setIsAudioPlaying(false);
              useSystemStore.getState().setSystemState('idle');
              currentAudio = null;
          };

          currentAudio.onerror = (e) => {
              console.error("Audio playback error", e);
              useSystemStore.getState().setIsAudioPlaying(false);
              useSystemStore.getState().setSystemState('idle');
          };

          currentAudio.play().catch(e => console.error("Auto-play failed", e));
      } catch (e) {
          console.error("Failed to decode/play audio", e);
      }
  }
};
