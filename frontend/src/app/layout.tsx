import type { Metadata } from "next";
import "./globals.css";
import { TranslationProvider } from "@/hooks/useTranslation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "AgriShield (کسان دوست) — AI Crop Disease Analyzer",
  description: "AI-Powered Crop Disease Diagnostics, Explainable AI (Grad-CAM) and Decision Support for Pakistani Farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur">
      <body className="bg-slate-50 min-h-screen pb-24 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <TranslationProvider>
          <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative flex flex-col shadow-2xl">
            <Header />
            <main className="flex-1 px-4 py-4">{children}</main>
            <BottomNav />
          </div>
        </TranslationProvider>
      </body>
    </html>
  );
}
