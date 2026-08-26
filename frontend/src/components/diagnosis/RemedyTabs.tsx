'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Leaf, FlaskConical, AlertCircle, ShieldAlert } from 'lucide-react';
import { Remedy } from '@/lib/api';

interface RemedyTabsProps {
  remedies: Remedy[];
  symptomsUrdu?: string;
  preventionUrdu?: string;
}

export function RemedyTabs({ remedies, symptomsUrdu, preventionUrdu }: RemedyTabsProps) {
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  const organicRemedies = remedies.filter((r) => r.remedy_type === 'ORGANIC');
  const chemicalRemedies = remedies.filter((r) => r.remedy_type === 'CHEMICAL');

  // Choose appropriate title/instruction field based on language
  const getRemedyTitle = (r: Remedy) => {
    if (lang === 'en' && r.title_english) return r.title_english;
    return r.title_urdu;
  };

  const getRemedyInstructions = (r: Remedy) => {
    if (lang === 'en' && r.instructions_english) return r.instructions_english;
    return r.instructions_urdu;
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200">
      {/* Segmented Tab Headers */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('organic')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'organic'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>{t('organic_tab')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chemical')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'chemical'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{t('chemical_tab')}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'organic' && (
        <div className="space-y-4">
          {organicRemedies.length > 0 ? (
            organicRemedies.map((remedy, idx) => (
              <div key={idx} className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  {getRemedyTitle(remedy)}
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line mb-3">
                  {getRemedyInstructions(remedy)}
                </p>
                {remedy.safety_warning_urdu && (
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{remedy.safety_warning_urdu}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">{t('no_organic_remedy')}</p>
          )}

          {preventionUrdu && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-1.5">{t('prevention_title')}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{preventionUrdu}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'chemical' && (
        <div className="space-y-4">
          {chemicalRemedies.length > 0 ? (
            chemicalRemedies.map((remedy, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-emerald-600" />
                  {getRemedyTitle(remedy)}
                </h3>

                {/* Local Brand Names */}
                {remedy.local_brands && (
                  <div className="bg-emerald-50 rounded-xl p-3 mb-3 border border-emerald-200">
                    <p className="text-[11px] font-bold text-emerald-800 mb-1">
                      {t('pakistani_brands_label')}
                    </p>
                    <p className="text-xs font-semibold text-emerald-950">
                      {remedy.local_brands}
                    </p>
                  </div>
                )}

                {/* Active Ingredient */}
                {remedy.active_ingredient && (
                  <p className="text-[11px] text-slate-600 mb-2">
                    <span className="font-semibold">{t('active_ingredient_label')} </span>
                    {remedy.active_ingredient}
                  </p>
                )}

                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line mb-3">
                  {getRemedyInstructions(remedy)}
                </p>

                {/* Pre-Harvest Interval & Safety */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200 text-slate-600">
                  <span>{t('phi_label')}</span>
                  <span className="font-bold text-slate-900">{remedy.pre_harvest_interval_days} {t('days')}</span>
                </div>

                {remedy.safety_warning_urdu && (
                  <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-red-800 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>{remedy.safety_warning_urdu}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">{t('no_chemical_needed')}</p>
          )}
        </div>
      )}
    </div>
  );
}
