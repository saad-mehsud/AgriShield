'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchScans, deleteScan, ScanItem } from '@/lib/api';
import { ScanHistoryCard } from '@/components/diary/ScanHistoryCard';
import { BookOpen, Camera, Loader2 } from 'lucide-react';

export default function DiaryPage() {
  const { t } = useTranslation();
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScans = async () => {
    try {
      setLoading(true);
      const res = await fetchScans();
      setScans(res.scans);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScans();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(t('delete_scan_confirm'))) {
      try {
        await deleteScan(id);
        setScans(scans.filter((s) => s.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg leading-tight">
              {t('diary')}
            </h2>
            <p className="text-[11px] text-slate-500">
              {t('diary_subtitle')} {scans.length}
            </p>
          </div>
        </div>

        <Link
          href="/scan"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{t('new_scan')}</span>
        </Link>
      </div>

      {/* Scans List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : scans.length > 0 ? (
        <div className="space-y-3">
          {scans.map((scan) => (
            <ScanHistoryCard
              key={scan.id}
              scan={scan}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            {t('no_scans_yet')}
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>{t('start_first_scan')}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
