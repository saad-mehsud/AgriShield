'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchWeatherAlerts, WeatherAlerts } from '@/lib/api';
import { PhoneCall, MessageCircle, CloudSun, MapPin } from 'lucide-react';

export default function AdvisoryPage() {
  const { t, lang } = useTranslation();
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlerts | null>(null);

  useEffect(() => {
    fetchWeatherAlerts().then(setWeatherAlerts).catch(console.error);
  }, []);

  const openWhatsAppGeneral = () => {
    const message = lang === 'en'
      ? `Hello Doctor, I need your advice regarding crop disease identification and spray dosage. (AgriShield Report)`
      : `السلام علیکم ڈاکٹر صاحب، مجھے اپنی فصل کی بیماری کی تشخیص اور دوا کے مشورے کے لیے آپ کی رہنمائی درکار ہے۔ (AgriShield Report)`;

    const text = encodeURIComponent(message);
    window.open(`https://wa.me/923001234567?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
          <PhoneCall className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg leading-tight">
            {t('advisory')}
          </h2>
          <p className="text-[11px] text-slate-500">
            {t('advisory_subtitle')}
          </p>
        </div>
      </div>

      {/* WhatsApp Action Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-green-800 rounded-3xl p-5 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">
              {t('whatsapp_agronomist_title')}
            </h3>
            <p className="text-xs text-white/80">
              {t('whatsapp_agronomist_desc')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openWhatsAppGeneral}
          className="w-full py-3.5 px-4 rounded-2xl bg-white text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 shadow hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>{t('whatsapp_chat_btn')}</span>
        </button>
      </div>

      {/* Weather & Outbreak Card */}
      {weatherAlerts && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <span>{t('weather_outbreak_title')}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {weatherAlerts.location}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">{t('weather_temp_label')}</p>
              <p className="text-base font-bold text-slate-900">{weatherAlerts.temperature_c}°C</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">{t('weather_humidity_label')}</p>
              <p className="text-base font-bold text-slate-900">{weatherAlerts.humidity_percent}%</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {weatherAlerts.alerts.map((alert, idx) => (
              <div key={idx} className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-950">
                    {lang === 'en' ? alert.crop : alert.crop_urdu}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                    {lang === 'en' ? alert.threat : alert.threat_urdu}
                  </span>
                </div>
                <p className="text-xs text-slate-700">{alert.reason_urdu}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
