
// AssemblyAI Universal Streaming Service
// Handles real-time audio capture, PCM16 encoding, and WebSocket communication

const ASSEMBLY_API_KEY = 'b48d02f9d202469dbf7d4c77402bb86e';

export class AssemblyAIClient {
  private socket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private onTranscriptCallback: (text: string, isFinal: boolean) => void;
  private onAudioLevelCallback: ((level: number) => void) | null = null;

  constructor(
    onTranscript: (text: string, isFinal: boolean) => void,
    onAudioLevel?: (level: number) => void
  ) {
    this.onTranscriptCallback = onTranscript;
    if (onAudioLevel) this.onAudioLevelCallback = onAudioLevel;
  }

  async start() {
    try {
      // 1. Get Microphone Access (16kHz required for best accuracy with AssemblyAI)
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // 2. Initialize WebSocket with optimized silence detection parameters
      // 1.2s max silence triggers end of turn
      const params = new URLSearchParams({
        sample_rate: '16000',
        token: ASSEMBLY_API_KEY,
        end_of_turn_confidence_threshold: '0.6',
        min_end_of_turn_silence_when_confident: '500',
        max_turn_silence: '1200',
        word_boost: '["Apex", "Revenue", "SDR", "ROI", "Lead", "Gen", "Pipeline"]'
      });

      this.socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?${params.toString()}`);

      this.socket.onopen = () => {
        console.log('[ATLAS] Voice Uplink Established (AssemblyAI)');
        this.startAudioProcessing();
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Handle Final Turns (Cleaned & Formatted)
        if (data.message_type === 'FinalTranscript') {
           if (data.text) {
             this.onTranscriptCallback(data.text, true);
           }
        } 
        // Handle Partial Transcripts (for realtime feedback if needed)
        else if (data.message_type === 'PartialTranscript' && data.text) {
           this.onTranscriptCallback(data.text, false);
        }
      };

      this.socket.onerror = (error) => {
        console.error('[ATLAS] Voice Uplink Error:', error);
      };

      this.socket.onclose = () => {
        console.log('[ATLAS] Voice Uplink Closed');
      };

    } catch (err) {
      console.error('[ATLAS] Failed to initialize voice:', err);
      throw err;
    }
  }

  private startAudioProcessing() {
    if (!this.stream) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const source = this.audioContext.createMediaStreamSource(this.stream);
    
    // Create ScriptProcessor for raw PCM access
    // Buffer size 4096 gives ~250ms chunks at 16k, good balance for streaming
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);

    this.processor.onaudioprocess = (e) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      
      // A. Calculate Volume Level for UI (RMS)
      if (this.onAudioLevelCallback) {
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const normalizedLevel = Math.min(1, rms * 5); 
        this.onAudioLevelCallback(normalizedLevel);
      }

      // B. Convert Float32 to Int16 (PCM) for AssemblyAI
      const buffer = new ArrayBuffer(inputData.length * 2);
      const outputView = new DataView(buffer);
      for (let i = 0; i < inputData.length; i++) {
        // Clamp between -1 and 1
        const s = Math.max(-1, Math.min(1, inputData[i]));
        // Scale to 16-bit integer range
        outputView.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }

      // C. Send Base64 encoded audio
      const base64Audio = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      this.socket.send(JSON.stringify({ 
        audio_data: base64Audio 
      }));
    };
  }

  stop() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ terminate_session: true }));
      this.socket.close();
    }
    this.socket = null;

    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;

    this.processor?.disconnect();
    this.processor = null;

    this.audioContext?.close();
    this.audioContext = null;
    
    if (this.onAudioLevelCallback) this.onAudioLevelCallback(0);
  }
}
