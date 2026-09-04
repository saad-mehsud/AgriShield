'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n/translations';

interface TranslationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.ur) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ur');

  useEffect(() => {
    const saved = localStorage.getItem('agrishield_lang') as Language;
    if (saved && (saved === 'ur' || saved === 'en' || saved === 'ps' || saved === 'sd')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('agrishield_lang', newLang);
  };

  const isRTL = lang === 'ur' || lang === 'ps' || lang === 'sd';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [isRTL, lang]);

  const t = (key: keyof typeof translations.ur): string => {
    const dict = translations[lang] || translations.ur;
    return (dict as any)[key] || translations.en[key] || String(key);
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-urdu' : 'font-sans'}>
        {children}
      </div>
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
