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
            {t('calculator_subtitle')}
          </p>
        </div>
      </div>

      <DosageCalculator />

      {/* Guide Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 text-xs">
          {t('land_rules_title')}
        </h4>
        <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{t('land_rule_1')}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{t('land_rule_2')}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{t('land_rule_3')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
