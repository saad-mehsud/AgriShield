'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Calculator, Droplets, FlaskRound, Layers } from 'lucide-react';
import { formatAcreageToTanks } from '@/lib/utils';
import { Dosage } from '@/lib/api';

interface DosageCalculatorProps {
  defaultDosage?: Dosage;
}

export function DosageCalculator({ defaultDosage }: DosageCalculatorProps) {
  const { t } = useTranslation();
  const [unit, setUnit] = useState<'acre' | 'kanal' | 'marla'>('acre');
  const [areaValue, setAreaValue] = useState<number>(1);

  // Convert input unit to Acres for calculation
  const getAcres = () => {
    switch (unit) {
      case 'kanal':
        return areaValue / 8; // 8 Kanals in 1 Acre
      case 'marla':
        return areaValue / 160; // 160 Marlas in 1 Acre
      default:
        return areaValue;
    }
  };

  const chemicalPerAcre = defaultDosage?.chemical_per_acre_grams || 250;
  const waterPerAcre = defaultDosage?.water_per_acre_liters || 100;
  const result = formatAcreageToTanks(getAcres(), waterPerAcre, chemicalPerAcre);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
          <Calculator className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm">{t('dosage_tab')}</h3>
      </div>

      {/* Unit Selector Chips */}
      <div className="flex gap-2 mb-4">
        {(['acre', 'kanal', 'marla'] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              unit === u
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {u === 'acre' ? t('area_unit_acre') : u === 'kanal' ? t('area_unit_kanal') : t('area_unit_marla')}
          </button>
        ))}
      </div>

      {/* Stepper Input */}
      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200 mb-4">
        <button
          type="button"
          onClick={() => setAreaValue(Math.max(0.5, Number((areaValue - (unit === 'acre' ? 0.5 : 1)).toFixed(1))))}
          className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 cursor-pointer"
        >
          -
        </button>

        <div className="text-center">
          <span className="text-xl font-bold text-slate-900">{areaValue}</span>
          <span className="text-xs text-slate-500 ms-1">
            {unit === 'acre' ? t('area_unit_acre') : unit === 'kanal' ? t('area_unit_kanal') : t('area_unit_marla')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAreaValue(Number((areaValue + (unit === 'acre' ? 0.5 : 1)).toFixed(1)))}
          className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Calculation Results Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{t('tanks_needed')}</span>
          </div>
          <p className="text-xl font-black text-emerald-950">
            {result.knapsackTanks20L} <span className="text-xs font-normal">{t('tanks_unit')}</span>
          </p>
        </div>

        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold mb-1">
            <Droplets className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{t('water_needed')}</span>
          </div>
          <p className="text-xl font-black text-emerald-950">
            {result.totalWaterLiters} <span className="text-xs font-normal">{t('liters_unit')}</span>
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-semibold mb-1">
            <FlaskRound className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{t('chemical_needed')}</span>
          </div>
          <p className="text-base font-bold text-slate-900">
            {result.totalChemicalGrams} <span className="text-xs font-normal">{t('grams_ml_unit')}</span>
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-semibold mb-1">
            <Calculator className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{t('per_tank_dosage')}</span>
          </div>
          <p className="text-base font-bold text-slate-900">
            {result.chemicalPerTankGrams} <span className="text-xs font-normal">{t('grams_tank_unit')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
