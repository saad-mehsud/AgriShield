'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ShieldCheck, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { DiagnosisData } from '@/lib/api';

interface DiagnosisCardProps {
  data: DiagnosisData;
}

export function DiagnosisCard({ data }: DiagnosisCardProps) {
  const { t } = useTranslation();

  const isHealthy = data.pathogen_type === 'HEALTHY';
  const confidencePercent = Math.round(data.confidence * 100);

  const severityBadge = () => {
    switch (data.severity) {
      case 'CRITICAL':
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('severe_risk')}
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('moderate_risk')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('healthy_crop')}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200">
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          🌾 {data.crop_name_urdu} ({data.crop_name})
        </span>
        {severityBadge()}
      </div>

      {/* Main Disease Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-1">
          {data.disease_name_urdu}
        </h2>
        <p className="text-sm font-medium text-slate-500">
          {data.disease_name}
        </p>
      </div>

      {/* Metric Indicators */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <p className="text-[11px] text-slate-500 mb-0.5">{t('confidence_label')}</p>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-base font-bold text-slate-900">{confidencePercent}%</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <p className="text-[11px] text-slate-500 mb-0.5">{t('latency_label')}</p>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-base font-bold text-slate-900">{data.inference_latency_ms} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
