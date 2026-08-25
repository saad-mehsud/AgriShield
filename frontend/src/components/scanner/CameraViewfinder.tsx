'use client';

import React, { useEffect, useRef } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useTranslation } from '@/hooks/useTranslation';
import { RefreshCw, Camera as CameraIcon, AlertCircle } from 'lucide-react';

interface CameraViewfinderProps {
  onCapture: (blob: Blob) => void;
  isProcessing?: boolean;
}

export function CameraViewfinder({ onCapture, isProcessing }: CameraViewfinderProps) {
  const { t } = useTranslation();
  const { videoRef, isStreaming, error, startCamera, stopCamera, toggleFacingMode, capturePhoto } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleShutter = async () => {
    if (isProcessing) return;
    const blob = await capturePhoto();
    if (blob) {
      onCapture(blob);
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800">
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Framing Reticle */}
      <div className="absolute inset-6 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
        <div className="text-center bg-slate-950/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 max-w-[80%]">
          <p className="text-white text-xs font-medium leading-relaxed">
            {t('hero_scanner_cta')}
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-white">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
          <p className="text-sm font-semibold mb-3">{error}</p>
          <button
            onClick={() => startCamera()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all"
          >
            Retry Camera / دوبارہ کوشش کریں
          </button>
        </div>
      )}

      {/* Control Buttons Overlay */}
      <div className="absolute bottom-4 left-0 right-0 px-6 flex items-center justify-between z-10">
        {/* Flip Camera */}
        <button
          type="button"
          onClick={toggleFacingMode}
          className="w-11 h-11 rounded-full bg-slate-900/70 backdrop-blur text-white flex items-center justify-center hover:bg-slate-800 transition-all border border-white/20"
          aria-label="Flip Camera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Big Shutter Trigger */}
        <button
          type="button"
          onClick={handleShutter}
          disabled={isProcessing || !isStreaming}
          className="w-18 h-18 p-1.5 rounded-full bg-emerald-500/30 backdrop-blur flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          aria-label="Take Photo"
        >
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-emerald-600">
            <CameraIcon className="w-6 h-6 text-emerald-700" />
          </div>
        </button>

        {/* Spacer for symmetry */}
        <div className="w-11" />
      </div>
    </div>
  );
}
