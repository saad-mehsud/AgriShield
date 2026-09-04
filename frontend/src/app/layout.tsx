import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TranslationProvider } from "@/hooks/useTranslation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "AgriShield (کسان دوست) — AI Crop Disease Analyzer",
  description:
    "AI-Powered Crop Disease Diagnostics, Explainable AI (Grad-CAM) and Decision Support for Pakistani Farmers.",
  keywords: ["crop disease", "agriculture", "AI", "Pakistan", "farmers", "AgriShield"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur">
      {/*
        min-h-dvh uses the dynamic viewport height on mobile, avoids 100vh address-bar issues.
        pb-[72px] leaves space for the fixed BottomNav.
      */}
      <body className="bg-slate-100 min-h-screen text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <TranslationProvider>
          {/* Full-bleed container that is responsive */}
          <div className="relative flex flex-col min-h-screen">
            <Header />
            {/*
              On mobile: simple single-column layout, max-w constrained
              On md (tablet): slightly wider + side padding
              On lg (laptop/desktop): proper wide layout with sidebar-like structure
            */}
            <main className="flex-1 w-full pb-24">
              {/* Content wrapper — responsive widths */}
              <div className="mx-auto px-4 py-4 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
                {children}
              </div>
            </main>
            <BottomNav />
          </div>
        </TranslationProvider>
      </body>
    </html>
  );
}
