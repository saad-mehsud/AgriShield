'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/lib/i18n/translations';
import { Globe, Sparkles } from 'lucide-react';

export function Header() {
  const { t, lang, setLang } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ur', label: 'اردو (Urdu)', flag: '🇵🇰' },
    { code: 'en', label: 'English', flag: '🌐' },
    { code: 'ps', label: 'پښتو (Pashto)', flag: '🏴' },
    { code: 'sd', label: 'سنڌي (Sindhi)', flag: '🌊' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-slate-900 text-lg leading-tight">
                {t('app_title')}
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {t('app_subtitle')}
            </p>
          </div>
        </Link>

        {/* Language Selector Button */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors border border-slate-200"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{languages.find(l => l.code === lang)?.label.split(' ')[0]}</span>
          </button>

          {showLangMenu && (
            <div className="absolute end-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-start px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    lang === l.code ? 'font-bold text-emerald-700 bg-emerald-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{l.label}</span>
                  <span>{l.flag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
