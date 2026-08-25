'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Home, Camera, BookOpen, Calculator, PhoneCall } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/diary', label: t('diary'), icon: BookOpen },
    { href: '/scan', label: t('scan'), icon: Camera, isPrimary: true },
    { href: '/calculator', label: t('calculator'), icon: Calculator },
    { href: '/advisory', label: t('advisory'), icon: PhoneCall },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-3 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-4 border-slate-50 transition-transform active:scale-95 group-hover:scale-105">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
                isActive
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
