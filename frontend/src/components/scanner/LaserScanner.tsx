'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface LaserScannerProps {
  imagePreviewUrl?: string;
  statusText?: string;
}

export function LaserScanner({ imagePreviewUrl, statusText = "AI تجزیہ کر رہا ہے... (Analyzing Leaf)" }: LaserScannerProps) {
  return (
    <div className="relative w-full aspect-[4/3] max-w-md mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/50 flex items-center justify-center">
      {/* Background Image Preview */}
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="Scanning leaf"
          className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90"
        />
      )}

      {/* Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      {/* Laser Scanning Line */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#22c55e] animate-laser-scan z-10" />

      {/* Status Badge */}
      <div className="relative z-20 bg-slate-950/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-emerald-500/30 flex items-center gap-3 shadow-lg">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <div className="text-start">
          <p className="text-white text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            PyTorch ML Core
          </p>
          <p className="text-[11px] text-emerald-300 font-medium">
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
}
