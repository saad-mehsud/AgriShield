'use client';

import React from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useTranslation } from '@/hooks/useTranslation';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface AudioPlayerProps {
  textToSpeak: string;
}

export function AudioPlayer({ textToSpeak }: AudioPlayerProps) {
  const { t, lang } = useTranslation();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const handleToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(textToSpeak, lang);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all shadow-md active:scale-[0.99] cursor-pointer ${
        isSpeaking
          ? 'bg-amber-600 text-white shadow-amber-600/30 animate-pulse'
          : 'bg-gradient-to-r from-emerald-700 to-green-700 text-white shadow-emerald-700/20 hover:from-emerald-800 hover:to-green-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 animate-bounce" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </div>
        <div className="text-start">
          <p className="text-sm font-bold leading-tight">
            {isSpeaking ? t('stop_audio') : t('listen_audio')}
          </p>
          <p className="text-[11px] text-white/80">
            {isSpeaking ? t('audio_stop_desc') : t('audio_listen_desc')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 px-3 py-1 rounded-xl shrink-0">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t('audio_badge')}</span>
      </div>
    </button>
  );
}
