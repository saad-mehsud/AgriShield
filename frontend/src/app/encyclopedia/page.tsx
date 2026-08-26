'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchDiseases, DiseaseItem } from '@/lib/api';
import { DiseaseCard } from '@/components/encyclopedia/DiseaseCard';
import { BookOpen, Search, Loader2 } from 'lucide-react';

export default function EncyclopediaPage() {
  const { t } = useTranslation();
  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const crops = [
    { slug: 'all', labelKey: 'all_crops' as const },
    { slug: 'cotton', labelKey: 'cotton' as const },
    { slug: 'wheat', labelKey: 'wheat' as const },
    { slug: 'rice', labelKey: 'rice' as const },
    { slug: 'sugarcane', labelKey: 'sugarcane' as const },
    { slug: 'tomato', labelKey: 'tomato' as const },
    { slug: 'potato', labelKey: 'potato' as const },
    { slug: 'citrus', labelKey: 'citrus' as const },
    { slug: 'apple', labelKey: 'apple' as const },
  ];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const cropFilter = selectedCrop === 'all' ? undefined : selectedCrop;
        const res = await fetchDiseases(cropFilter, searchQuery || undefined);
        setDiseases(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCrop, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg leading-tight">
            {t('encyclopedia')}
          </h2>
          <p className="text-[11px] text-slate-500">
            {t('encyclopedia_subtitle')}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full py-3 px-4 ps-10 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3.5" />
      </div>

      {/* Crop Filter Horizontal Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {crops.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setSelectedCrop(c.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              selectedCrop === c.slug
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : diseases.length > 0 ? (
        <div className="space-y-3">
          {diseases.map((d) => (
            <DiseaseCard key={d.id} disease={d} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500">{t('no_diseases_found')}</p>
        </div>
      )}
    </div>
  );
}
