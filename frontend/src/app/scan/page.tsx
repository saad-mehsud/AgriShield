'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { CameraViewfinder } from '@/components/scanner/CameraViewfinder';
import { LaserScanner } from '@/components/scanner/LaserScanner';
import { ImagePlus, Camera as CameraIcon, AlertCircle, Loader2 } from 'lucide-react';
import { diagnoseLeaf } from '@/lib/api';

function ScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchParams.get('mode') === 'camera') {
      setMode('camera');
    }
  }, [searchParams]);

  const handleProcessImage = async (fileOrBlob: Blob | File) => {
    setIsProcessing(true);
    setErrorMsg(null);

    const localUrl = URL.createObjectURL(fileOrBlob);
    setPreviewUrl(localUrl);

    try {
      const formData = new FormData();
      formData.append('image', fileOrBlob, 'leaf.jpg');

      const result = await diagnoseLeaf(formData);

      sessionStorage.setItem('last_diagnosis', JSON.stringify(result));
      router.push('/scan/result');
    } catch (err: any) {
      console.error('Diagnosis Error:', err);
      const isConnectionError = err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError');
      if (isConnectionError) {
        setErrorMsg(t('backend_offline_error'));
      } else {
        setErrorMsg(t('backend_offline_error'));
      }
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessImage(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleProcessImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-200">
        <button
          type="button"
          onClick={() => setMode('upload')}
          disabled={isProcessing}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'upload'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImagePlus className="w-4 h-4" />
          <span>{t('upload_btn')}</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('camera')}
          disabled={isProcessing}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'camera'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CameraIcon className="w-4 h-4" />
          <span>{t('camera_btn')}</span>
        </button>
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="bg-red-50 text-red-800 p-4 rounded-2xl border border-red-200 flex flex-col gap-2 text-xs font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-red-200/60 text-[11px] text-slate-700">
            <p className="font-semibold mb-1">{t('backend_start_instruction')}</p>
            <code className="block bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-[10px]">
              ./start.sh
            </code>
          </div>
        </div>
      )}

      {/* Processing State with Laser Scanner Animation */}
      {isProcessing ? (
        <LaserScanner imagePreviewUrl={previewUrl || undefined} statusText={t('analyzing_leaf')} />
      ) : mode === 'camera' ? (
        <CameraViewfinder onCapture={handleProcessImage} isProcessing={isProcessing} />
      ) : (
        /* Gallery Upload Area */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full aspect-[4/3] max-w-md mx-auto bg-white rounded-3xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-sm group ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50 scale-[1.02]'
              : 'border-emerald-400 hover:bg-emerald-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ImagePlus className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {t('upload_click_title')}
          </h3>
          <p className="text-xs text-slate-500 max-w-[80%] mb-2">
            {t('upload_click_desc')}
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
            {t('gallery_btn_label')}
          </span>
        </div>
      )}

      {/* User Field Tip */}
      <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
        <span className="font-bold shrink-0">{t('scan_tip_title')}</span>
        <span className="text-[11px] leading-relaxed">
          {t('scan_tip_desc')}
        </span>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-emerald-700">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  );
}
