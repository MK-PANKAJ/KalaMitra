import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { voiceService, VoiceRecognitionResult } from '../utils/voiceUtils';
import { useApp } from '../context/AppContext';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  language?: 'en' | 'hi';
  autoSpeak?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  placeholder = 'Click microphone to start speaking...',
  language = 'en',
  autoSpeak,
}) => {
  const { state, dispatch } = useApp();
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (autoSpeak) {
      handleSpeak(autoSpeak);
    }
  }, [autoSpeak]);

  const handleStartListening = () => {
    if (!voiceService.isSupported()) {
      setError('Voice recognition is not supported in this browser');
      return;
    }

    setError('');
    setTranscript('');
    setInterimTranscript('');
    dispatch({ type: 'SET_LISTENING', payload: true });

    voiceService.startListening(
      language,
      (result: VoiceRecognitionResult) => {
        if (result.isFinal) {
          const newTranscript = transcript + ' ' + result.transcript;
          setTranscript(newTranscript);
          setInterimTranscript('');
          onTranscript(newTranscript.trim());
        } else {
          setInterimTranscript(result.transcript);
        }
      },
      (err: string) => {
        setError(`Error: ${err}`);
        dispatch({ type: 'SET_LISTENING', payload: false });
      }
    );
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    dispatch({ type: 'SET_LISTENING', payload: false });
    if (interimTranscript) {
      const finalTranscript = transcript + ' ' + interimTranscript;
      setTranscript(finalTranscript);
      onTranscript(finalTranscript.trim());
      setInterimTranscript('');
    }
  };

  const handleSpeak = (text: string) => {
    dispatch({ type: 'SET_SPEAKING', payload: true });
    voiceService.speak(
      text,
      language,
      () => {
        dispatch({ type: 'SET_SPEAKING', payload: false });
      },
      (err: string) => {
        setError(`Speech error: ${err}`);
        dispatch({ type: 'SET_SPEAKING', payload: false });
      }
    );
  };

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
    dispatch({ type: 'SET_SPEAKING', payload: false });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={transcript + (interimTranscript ? ' ' + interimTranscript : '')}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscript(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full p-4 pr-20 border-2 border-terracotta-200 rounded-lg focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-200 outline-none resize-none min-h-[100px] text-gray-700"
          disabled={state.isListening}
        />
        <div className="absolute right-3 bottom-3 flex gap-2">
          {state.isSpeaking ? (
            <button
              onClick={handleStopSpeaking}
              className="p-2 bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-colors shadow-lg"
              title="Stop speaking"
            >
              <Volume2 size={20} />
            </button>
          ) : transcript && (
            <button
              onClick={() => handleSpeak(transcript)}
              className="p-2 bg-gold-400 text-white rounded-full hover:bg-gold-500 transition-colors"
              title="Read aloud"
            >
              <Volume2 size={20} />
            </button>
          )}
          <button
            onClick={state.isListening ? handleStopListening : handleStartListening}
            className={`p-2 rounded-full transition-all shadow-lg ${
              state.isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-terracotta-500 hover:bg-terracotta-600'
            } text-white`}
            title={state.isListening ? 'Stop recording' : 'Start recording'}
          >
            {state.isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
      </div>
      {interimTranscript && (
        <div className="text-sm text-gray-500 italic">
          Listening: {interimTranscript}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
