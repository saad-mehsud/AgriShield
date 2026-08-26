'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { DiagnosisData } from '@/lib/api';
import { GradCamViewer } from '@/components/diagnosis/GradCamViewer';
import { DiagnosisCard } from '@/components/diagnosis/DiagnosisCard';
import { AudioPlayer } from '@/components/diagnosis/AudioPlayer';
import { RemedyTabs } from '@/components/diagnosis/RemedyTabs';
import { DosageCalculator } from '@/components/diagnosis/DosageCalculator';
import { Share2, Camera, ArrowLeft } from 'lucide-react';

export default function ScanResultPage() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [data, setData] = useState<DiagnosisData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('last_diagnosis');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-sm text-slate-500 font-medium">{t('no_recent_result')}</p>
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 text-white font-bold text-xs shadow-md"
        >
          <Camera className="w-4 h-4" />
          <span>{t('hero_scanner_cta')}</span>
        </Link>
      </div>
    );
  }

  const cropTitle = lang === 'en' ? data.crop_name : `${data.crop_name_urdu} (${data.crop_name})`;
  const diseaseTitle = lang === 'en' ? data.disease_name : `${data.disease_name_urdu} (${data.disease_name})`;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🌾 AgriShield Report:\nCrop: ${cropTitle}\nDisease: ${diseaseTitle}\nConfidence: ${Math.round(data.confidence * 100)}%\n\nPrescription: ${data.audio_urdu_text}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/scan"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('scan_another')}</span>
        </Link>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('share_btn')}</span>
        </button>
      </div>

      {/* 1. Explainable AI (Grad-CAM) Visual Viewer */}
      <GradCamViewer
        originalImageUrl={data.image_url}
        heatmapImageUrl={data.heatmap_url}
        cropName={data.crop_name}
        diseaseName={data.disease_name}
      />

      {/* 2. Diagnosis Summary Card */}
      <DiagnosisCard data={data} />

      {/* 3. Voice Audio Player */}
      <AudioPlayer textToSpeak={data.audio_urdu_text} />

      {/* 4. Dual Remedies (Organic vs Chemical Pakistani Brands) */}
      <RemedyTabs
        remedies={data.remedies}
        symptomsUrdu={data.symptoms_urdu}
        preventionUrdu={data.prevention_urdu}
      />

      {/* 5. Spray Dosage Calculator (Acre / Kanal / Marla) */}
      {data.dosage && <DosageCalculator defaultDosage={data.dosage} />}

      {/* WhatsApp Agronomist Trigger */}
      <button
        type="button"
        onClick={handleShareWhatsApp}
        className="w-full py-4 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 active:scale-[0.99] transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>{t('whatsapp_share')}</span>
      </button>
    </div>
  );
}
