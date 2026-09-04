'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Global reference to prevent Chrome garbage-collection bug on SpeechSynthesisUtterance
declare global {
  interface Window {
    _activeUtterance?: SpeechSynthesisUtterance | null;
    _activeAudioElement?: HTMLAudioElement | null;
  }
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load and cache browser voices when available
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Automatically stop playback when the component using this hook unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        if ('speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
          } catch (e) {}
        }
        if (window._activeAudioElement) {
          window._activeAudioElement.pause();
          window._activeAudioElement = null;
        }
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Stop Web Speech API
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    window._activeUtterance = null;

    // Stop HTML5 Audio fallback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (window._activeAudioElement) {
      window._activeAudioElement.pause();
      window._activeAudioElement = null;
    }

    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string, langCode: string = 'ur') => {
    if (typeof window === 'undefined' || !text.trim()) return;

    // Stop any existing playback first
    stop();

    // Map app language to appropriate speech synthesis tags
    const speechLangMap: Record<string, string> = {
      ur: 'ur-PK',
      ps: 'ur-PK', // Urdu phonetics match Pashto/Sindhi best in standard synthesizers
      sd: 'ur-PK',
      en: 'en-US',
    };
    const targetLang = speechLangMap[langCode] || 'ur-PK';

    // 1. Try Native Web Speech API first
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume(); // Fix Chrome paused bug

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Try to match best voice
        const allVoices = window.speechSynthesis.getVoices();
        const matchedVoice = allVoices.find(v => 
          v.lang.toLowerCase().startsWith(langCode) ||
          v.lang.toLowerCase().includes('ur') ||
          v.lang.toLowerCase().includes('hi') ||
          v.name.toLowerCase().includes('urdu') ||
          v.name.toLowerCase().includes('hindi')
        );

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          window._activeUtterance = null;
        };
        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error, falling back to Audio stream:', e);
          setIsSpeaking(false);
          window._activeUtterance = null;
          playFallbackAudio(text, langCode);
        };

        window._activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        return;
      } catch (err) {
        console.warn('SpeechSynthesis exception, trying fallback:', err);
      }
    }

    // 2. Audio Stream Fallback (Google TTS API)
    playFallbackAudio(text, langCode);
  }, [stop]);

  const playFallbackAudio = (text: string, langCode: string) => {
    try {
      const truncatedText = encodeURIComponent(text.slice(0, 200)); // Google TTS single chunk limit
      const audioLang = langCode === 'en' ? 'en' : 'ur';
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${audioLang}&client=tw-ob&q=${truncatedText}`;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      window._activeAudioElement = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        window._activeAudioElement = null;
      };
      audio.onerror = (e) => {
        console.error('Audio fallback playback error:', e);
        setIsSpeaking(false);
      };

      audio.play().catch(e => {
        console.warn('Audio play prevented by browser policy:', e);
        setIsSpeaking(false);
      });
    } catch (e) {
      console.error('Failed to trigger audio fallback:', e);
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking, isSupported };
}
