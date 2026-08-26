'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { DiseaseItem } from '@/lib/api';

interface DiseaseCardProps {
  disease: DiseaseItem;
  onSelect?: (id: string) => void;
}

export function DiseaseCard({ disease, onSelect }: DiseaseCardProps) {
  const { t, lang } = useTranslation();

  const cropDisplay = lang === 'en' ? disease.crop_name : `${disease.crop_name_urdu} (${disease.crop_name})`;
  const diseaseTitle = lang === 'en' ? disease.disease_name : disease.disease_name_urdu;
  const diseaseSubtitle = lang === 'en' ? disease.disease_name_urdu : disease.disease_name;

  return (
    <div
      onClick={() => onSelect && onSelect(disease.id)}
      className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          🌾 {cropDisplay}
        </span>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {disease.pathogen_type}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 text-base mb-0.5">
        {diseaseTitle}
      </h3>
      <p className="text-xs text-slate-500 font-medium mb-3">
        {diseaseSubtitle}
      </p>

      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-3">
        {disease.symptoms_urdu}
      </p>

      {disease.local_brands && (
        <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-emerald-900 font-medium border border-slate-200">
          <span className="font-bold text-slate-600">{t('pakistani_brands_label')} </span>
          {disease.local_brands}
        </div>
      )}
    </div>
  );
}
