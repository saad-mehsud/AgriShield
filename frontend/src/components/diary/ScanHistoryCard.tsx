'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ScanItem, API_BASE } from '@/lib/api';
import { Calendar, Trash2, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ScanHistoryCardProps {
  scan: ScanItem;
  onDelete?: (id: string) => void;
}

export function ScanHistoryCard({ scan, onDelete }: ScanHistoryCardProps) {
  const { t } = useTranslation();

  const thumbUrl = scan.thumbnail_url
    ? (scan.thumbnail_url.startsWith('http') ? scan.thumbnail_url : `${API_BASE}${scan.thumbnail_url}`)
    : (scan.image_url.startsWith('http') ? scan.image_url : `${API_BASE}${scan.image_url}`);

  const formattedDate = new Date(scan.scanned_at).toLocaleDateString('ur-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🌾 AgriShield (کسان دوست) رپورٹ:\nفصل: ${scan.crop_name_urdu}\nبیماری: ${scan.disease_name_urdu}\nدرستگی: ${Math.round(scan.confidence * 100)}%\nتاریخ: ${formattedDate}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex gap-3.5 items-center hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="w-18 h-18 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
        <img
          src={thumbUrl}
          alt={scan.disease_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            {scan.crop_name_urdu}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        <h4 className="font-bold text-slate-900 text-sm truncate mb-0.5">
          {scan.disease_name_urdu}
        </h4>
        <p className="text-[11px] text-slate-500 truncate">
          {scan.disease_name}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors border border-emerald-200"
          title="Share to WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(scan.id)}
            className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors border border-red-200"
            title="Delete Scan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
