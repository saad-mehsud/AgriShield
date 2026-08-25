'use client';

import React from 'react';
import { DiseaseItem } from '@/lib/api';
import { Leaf, ShieldAlert } from 'lucide-react';

interface DiseaseCardProps {
  disease: DiseaseItem;
  onSelect?: (id: string) => void;
}

export function DiseaseCard({ disease, onSelect }: DiseaseCardProps) {
  return (
    <div
      onClick={() => onSelect && onSelect(disease.id)}
      className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          🌾 {disease.crop_name_urdu} ({disease.crop_name})
        </span>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {disease.pathogen_type}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 text-base mb-0.5">
        {disease.disease_name_urdu}
      </h3>
      <p className="text-xs text-slate-500 font-medium mb-3">
        {disease.disease_name}
      </p>

      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-3">
        {disease.symptoms_urdu}
      </p>

      {disease.local_brands && (
        <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-emerald-900 font-medium border border-slate-200">
          <span className="font-bold text-slate-600">پاکستانی برانڈز: </span>
          {disease.local_brands}
        </div>
      )}
    </div>
  );
}
