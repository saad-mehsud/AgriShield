'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { DosageCalculator } from '@/components/diagnosis/DosageCalculator';
import { Calculator } from 'lucide-react';

export default function CalculatorPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg leading-tight">
            {t('calculator')}
          </h2>
          <p className="text-[11px] text-slate-500">
            ایکڑ، کنال اور مرلہ کے حساب سے 20 لیٹر ٹینکیوں اور دوا کی مقدار معلوم کریں
          </p>
        </div>
      </div>

      <DosageCalculator />

      {/* Guide Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 text-xs">
          🌾 پاکستانی زرعی پیمائش کے اصول (Land Standards):
        </h4>
        <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>1 ایکڑ (Acre) = 8 کنال (Kanals) = 160 مرلہ (Marlas)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>1 ایکڑ کے لیے اوسطاً 100 سے 120 لیٹر پانی (5 سے 6 ٹینکیاں) درکار ہوتی ہیں۔</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>ہمیشہ صاف پانی استعمال کریں اور تیز دھوپ میں اسپرے سے گریز کریں۔</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
