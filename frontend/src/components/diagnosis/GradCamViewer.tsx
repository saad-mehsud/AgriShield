'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Flame, Image as ImageIcon, Eye } from 'lucide-react';
import { API_BASE } from '@/lib/api';

interface GradCamViewerProps {
  originalImageUrl: string;
  heatmapImageUrl?: string;
  cropName: string;
  diseaseName: string;
}

export function GradCamViewer({
  originalImageUrl,
  heatmapImageUrl,
  cropName,
  diseaseName,
}: GradCamViewerProps) {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'original' | 'heatmap'>('heatmap');

  const fullOriginalUrl = originalImageUrl.startsWith('http')
    ? originalImageUrl
    : `${API_BASE}${originalImageUrl}`;

  const fullHeatmapUrl = heatmapImageUrl
    ? (heatmapImageUrl.startsWith('http') || heatmapImageUrl.startsWith('data:')
        ? heatmapImageUrl
        : `${API_BASE}${heatmapImageUrl}`)
    : fullOriginalUrl;

  return (
    <div className="bg-white rounded-3xl p-3 shadow-md border border-slate-200">
      {/* Interactive Toggle Pill */}
      <div className="flex items-center justify-center p-1 bg-slate-100 rounded-2xl mb-3 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveView('heatmap')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeView === 'heatmap'
              ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{t('heatmap_view')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('original')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeView === 'original'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{t('original_photo')}</span>
        </button>
      </div>

      {/* Image Display */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
        <img
          src={activeView === 'heatmap' ? fullHeatmapUrl : fullOriginalUrl}
          alt={`${cropName} - ${diseaseName}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Explainable AI Tag */}
        {activeView === 'heatmap' && (
          <div className="absolute bottom-2.5 start-2.5 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-medium text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>Grad-CAM: سرخ رنگ بیمار پتوں کی نشاندہی کرتا ہے</span>
          </div>
        )}
      </div>
    </div>
  );
}
