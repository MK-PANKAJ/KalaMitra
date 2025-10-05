export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  startListening(
    language: 'en' | 'hi',
    onResult: (result: VoiceRecognitionResult) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    this.recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      
      onResult({
        transcript,
        confidence: result[0].confidence,
        isFinal: result.isFinal,
      });
    };

    this.recognition.onerror = (event: any) => {
      onError?.(event.error);
    };

    this.recognition.start();
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  speak(
    text: string,
    language: 'en' | 'hi',
    onEnd?: () => void,
    onError?: (error: string) => void
  ): void {
    // Cancel any ongoing speech
    this.synthesis.cancel();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    this.currentUtterance.rate = 0.9;
    this.currentUtterance.pitch = 1;

    // Try to find a voice for the language
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language === 'hi' ? 'hi' : 'en'));
    if (voice) {
      this.currentUtterance.voice = voice;
    }

    this.currentUtterance.onend = () => {
      onEnd?.();
    };

    this.currentUtterance.onerror = (event: any) => {
      onError?.(event.error);
    };

    this.synthesis.speak(this.currentUtterance);
  }

  stopSpeaking(): void {
    this.synthesis.cancel();
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }
}

export const voiceService = new VoiceService();
