'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchDiseases, fetchDiseaseDetail, DiseaseItem, DiseaseDetail } from '@/lib/api';
import { DiseaseCard } from '@/components/encyclopedia/DiseaseCard';
import { RemedyTabs } from '@/components/diagnosis/RemedyTabs';
import { AudioPlayer } from '@/components/diagnosis/AudioPlayer';
import { DosageCalculator } from '@/components/diagnosis/DosageCalculator';
import { BookOpen, Search, Loader2, AlertCircle, X } from 'lucide-react';

export default function EncyclopediaPage() {
  const { t, lang } = useTranslation();
  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Selected disease detail modal state
  const [activeDetail, setActiveDetail] = useState<DiseaseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  // Debounce search query — wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch diseases when crop filter or debounced search changes
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const cropFilter = selectedCrop === 'all' ? undefined : selectedCrop;
        const res = await fetchDiseases(cropFilter, debouncedSearch || undefined);
        setDiseases(res);
      } catch (e) {
        console.error(e);
        setError(t('backend_offline_error'));
        setDiseases([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCrop, debouncedSearch]);

  const handleSelectDisease = async (id: string) => {
    try {
      setDetailLoading(true);
      const detail = await fetchDiseaseDetail(id);
      setActiveDetail(detail);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Disease Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : diseases.length > 0 ? (
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 xl:grid-cols-3">
          {diseases.map((d) => (
            <DiseaseCard key={d.id} disease={d} onSelect={handleSelectDisease} />
          ))}
        </div>
      ) : (
        !error && (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">{t('no_diseases_found')}</p>
          </div>
        )
      )}

      {/* Detail Modal Overlay */}
      {activeDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  🌾 {lang === 'en' ? activeDetail.crop_name : activeDetail.crop_name_urdu}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {lang === 'en' ? activeDetail.disease_name : activeDetail.disease_name_urdu}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetail(null)}
                className="w-9 h-9 rounded-full bg-white text-slate-600 flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AudioPlayer textToSpeak={activeDetail.symptoms_urdu} />

            <RemedyTabs
              remedies={activeDetail.remedies}
              symptomsUrdu={activeDetail.symptoms_urdu}
              preventionUrdu={activeDetail.prevention_urdu}
            />

            {activeDetail.dosage && <DosageCalculator defaultDosage={activeDetail.dosage} />}
          </div>
        </div>
      )}
    </div>
  );
}
