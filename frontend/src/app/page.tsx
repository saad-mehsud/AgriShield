'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { TranslationKey } from '@/lib/i18n/translations';
import {
  Camera,
  ImagePlus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Calculator,
  PhoneCall,
} from 'lucide-react';
import { fetchScans, fetchWeatherAlerts, ScanItem, WeatherAlerts } from '@/lib/api';
import { ScanHistoryCard } from '@/components/diary/ScanHistoryCard';

export default function HomePage() {
  const { t, lang } = useTranslation();
  const [recentScans, setRecentScans] = useState<ScanItem[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlerts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [scansData, weatherData] = await Promise.allSettled([
          fetchScans(),
          fetchWeatherAlerts(),
        ]);
        if (scansData.status === 'fulfilled') {
          setRecentScans(scansData.value.scans.slice(0, 3));
        }
        if (weatherData.status === 'fulfilled') {
          setWeatherAlerts(weatherData.value);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-5">
      {/*
        On desktop (lg+), we show a 2-column layout:
        - Left col: hero scanner + quick actions + weather
        - Right col: recent scans (wider)
      */}
      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-6 xl:grid-cols-[1fr_420px]">

        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Hero Scanner Banner */}
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-700 p-6 text-white shadow-xl overflow-hidden">
            {/* Decorative blur circles */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur border border-white/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {t('ml_status_online')}
              </span>

              <h2 className="text-2xl font-black leading-tight mb-2">
                {t('hero_scanner_cta')}
              </h2>
              <p className="text-xs text-white/85 leading-relaxed mb-5">
                {t('hero_scanner_desc')}
              </p>

              <div className="flex gap-2.5">
                <Link
                  href="/scan?mode=camera"
                  className="flex-1 py-3 px-4 rounded-2xl bg-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-black/10 hover:bg-emerald-50 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>{t('camera_btn')}</span>
                </Link>

                <Link
                  href="/scan?mode=upload"
                  className="flex-1 py-3 px-4 rounded-2xl bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 backdrop-blur border border-white/20 hover:bg-white/30 active:scale-95 transition-all"
                >
                  <ImagePlus className="w-4 h-4" />
                  <span>{t('upload_btn')}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Access Action Grid — 3 cols on mobile, 3 on tablet, 3 on desktop */}
          <div className="grid grid-cols-3 gap-2.5">
            <Link
              href="/calculator"
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{t('calculator')}</span>
              <span className="text-[10px] text-slate-400 hidden sm:block">{t('quick_calc_subtitle')}</span>
            </Link>

            <Link
              href="/encyclopedia"
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{t('encyclopedia')}</span>
              <span className="text-[10px] text-slate-400 hidden sm:block">{t('quick_encyclopedia_subtitle')}</span>
            </Link>

            <Link
              href="/advisory"
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{t('advisory')}</span>
              <span className="text-[10px] text-slate-400 hidden sm:block">{t('quick_advisory_subtitle')}</span>
            </Link>
          </div>

          {/* Weather Outbreak Warning */}
          {weatherAlerts && weatherAlerts.alerts.length > 0 && (
            <div className="bg-amber-50 rounded-3xl p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t('weather_risk_title')}</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {t('weather_humidity_label')}: {weatherAlerts.humidity_percent}%
                </span>
              </div>
              <div className="space-y-1.5">
                {weatherAlerts.alerts.slice(0, 2).map((alert, idx) => (
                  <div key={idx} className="bg-white/80 rounded-xl p-2.5 text-xs text-slate-800 border border-amber-200/60">
                    <span className="font-bold text-amber-900">
                      {lang === 'en' ? alert.crop : alert.crop_urdu}:{' '}
                    </span>
                    <span>{alert.reason_urdu}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent scans — shows inline on mobile, hides on lg (shown in right col) */}
          <div className="lg:hidden">
            <RecentScans recentScans={recentScans} loading={loading} t={t} />
          </div>
        </div>

        {/* RIGHT COLUMN — only visible on lg+ */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <RecentScans recentScans={recentScans} loading={loading} t={t} />
          </div>
        </div>

      </div>
    </div>
  );
}

// Extracted to avoid duplication between mobile inline and desktop sidebar
function RecentScans({
  recentScans,
  loading,
  t,
}: {
  recentScans: ScanItem[];
  loading: boolean;
  t: (key: TranslationKey) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-slate-900 text-sm">{t('recent_scans')}</h3>
        <Link
          href="/diary"
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
        >
          <span>{t('view_all')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded-full mb-3 w-3/4" />
          <div className="h-4 bg-slate-200 rounded-full w-1/2" />
        </div>
      ) : recentScans.length > 0 ? (
        <div className="space-y-2.5">
          {recentScans.map((scan) => (
            <ScanHistoryCard key={scan.id} scan={scan} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-sm">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
          <p className="text-xs text-slate-500 font-medium mb-3">{t('no_scans_yet')}</p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800 transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t('camera_btn')}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
