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

  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchParams.get('mode') === 'upload') {
      setMode('upload');
    }
  }, [searchParams]);

  const handleProcessImage = async (fileOrBlob: Blob | File) => {
    setIsProcessing(true);
    setErrorMsg(null);

    // Create local preview URL for laser scanner animation
    const localUrl = URL.createObjectURL(fileOrBlob);
    setPreviewUrl(localUrl);

    try {
      const formData = new FormData();
      formData.append('image', fileOrBlob, 'leaf.jpg');

      const result = await diagnoseLeaf(formData);

      // Store result in sessionStorage for instant retrieval on result page
      sessionStorage.setItem('last_diagnosis', JSON.stringify(result));
      router.push('/scan/result');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('تصویر کا تجزیہ کرنے میں مسئلہ پیش آیا ہے۔ براہ کرم دوبارہ کوشش کریں۔');
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessImage(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-200">
        <button
          type="button"
          onClick={() => setMode('camera')}
          disabled={isProcessing}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'camera'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CameraIcon className="w-4 h-4" />
          <span>{t('camera_btn')}</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('upload')}
          disabled={isProcessing}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'upload'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImagePlus className="w-4 h-4" />
          <span>{t('upload_btn')}</span>
        </button>
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="bg-red-50 text-red-800 p-3.5 rounded-2xl border border-red-200 flex items-center gap-2 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Processing State with Laser Scanner Animation */}
      {isProcessing ? (
        <LaserScanner imagePreviewUrl={previewUrl || undefined} />
      ) : mode === 'camera' ? (
        <CameraViewfinder onCapture={handleProcessImage} isProcessing={isProcessing} />
      ) : (
        /* Gallery Upload Area */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[4/3] max-w-md mx-auto bg-white rounded-3xl border-2 border-dashed border-emerald-400 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50/50 transition-all shadow-sm group"
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
            تصویر منتخب کریں (Click to select image)
          </h3>
          <p className="text-xs text-slate-500 max-w-[80%]">
            JPEG, PNG یا WebP فارمیٹ میں پتے کی واضح تصویر اپ لوڈ کریں
          </p>
        </div>
      )}

      {/* User Field Tip */}
      <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
        <span className="font-bold shrink-0">💡 بہترین نتائج کے لیے:</span>
        <span className="text-[11px] leading-relaxed">
          پتے کو سورج کی مناسب روشنی میں سیدھا رکھیں اور کیمرے کو بیماری کے داغ کے قریب لائیں۔
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
