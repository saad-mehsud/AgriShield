# 🚀 Agent Implementation Plan (Vibecoding Roadmap)
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 1.0.0  
**Target Audience:** AI Coding Agents & Pair-Programming Engineers  
**Execution Strategy:** Step-by-Step Autonomous Phases with Continuous Verification & Acceptance Criteria.

---

## 1. Project Directory & File Tree Structure

The project will be built using **Next.js 14/15 App Router + TypeScript + Tailwind CSS + Lucide Icons + Dexie.js + TensorFlow.js**:

```
Crop Disease Analysis/
├── Docs/                                 # Complete Specification Documents
│   ├── 1_PRD.md
│   ├── 2_TRD.md
│   ├── 3_UI_UX_Design.md
│   ├── 4_App_Flow.md
│   ├── 5_Backend_and_Database_Schema.md
│   ├── 6_Implementation_Plan.md
│   ├── 7_Vibecoding_Rules_and_Conventions.md
│   ├── 8_API_Contracts_and_Data_Specs.md
│   └── README.md
├── public/
│   ├── models/                          # TF.js Quantized Model Files
│   │   ├── model.json                   # MobileNetV2 Architecture & Topology
│   │   └── group1-shard1of1.bin         # INT8/FP16 Quantized Weights (~3.2MB)
│   ├── icons/                           # PWA Icons & Splash Graphics
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── favicon.ico
│   ├── audio/                           # Pre-rendered Audio Snippets (Fallback)
│   └── manifest.json                    # PWA Web App Manifest
├── prisma/
│   ├── schema.prisma                    # Database Models (Postgres / SQLite)
│   └── seed.ts                          # Comprehensive 38+ Crop Disease Knowledge Seed
├── src/
│   ├── app/                             # Next.js App Router Pages
│   │   ├── layout.tsx                   # Root Layout with Font & Meta config
│   │   ├── page.tsx                     # Main Dashboard / Home Page
│   │   ├── onboarding/
│   │   │   └── page.tsx                 # Language Selector & Setup
│   │   ├── scan/
│   │   │   ├── page.tsx                 # Live Camera Viewfinder & Image Picker
│   │   │   └── result/
│   │   │       └── page.tsx             # Diagnosis Report, Audio & Remedy Tabs
│   │   ├── diary/
│   │   │   ├── page.tsx                 # Field History & Offline Diary
│   │   │   └── [id]/
│   │   │       └── page.tsx             # Historical Scan Detail
│   │   ├── encyclopedia/
│   │   │   ├── page.tsx                 # 38+ Disease Catalog & Search
│   │   │   └── [id]/
│   │   │       └── page.tsx             # Disease Profile & Prevention Manual
│   │   ├── calculator/
│   │   │   └── page.tsx                 # Standalone Chemical Dosage Calculator
│   │   ├── advisory/
│   │   │   └── page.tsx                 # Outbreak Map & WhatsApp Agronomist Bridge
│   │   └── api/                         # Backend API Routes
│   │       ├── diagnose/route.ts        # Server-side ML Fallback
│   │       ├── diseases/route.ts        # Disease Knowledge API
│   │       ├── sync/scans/route.ts      # Offline Sync Endpoint
│   │       └── weather/alerts/route.ts  # Weather Risk Advisory
│   ├── components/                      # Modular UI Components
│   │   ├── layout/                      # Navbar, BottomNavigation, Header, RTLProvider
│   │   ├── scanner/                     # CameraViewfinder, ShutterButton, GuidelineOverlay
│   │   ├── diagnosis/                   # DiagnosisCard, AudioPlayer, RemedyTabs, DosageCalculator
│   │   ├── diary/                       # ScanHistoryCard, FilterBar, SyncStatusPill
│   │   ├── encyclopedia/                # DiseaseCard, CropFilterPill, SearchInput
│   │   ├── ui/                          # Button, Card, Badge, Modal, Tabs, Slider, Toast
│   │   └── shared/                      # LanguageToggle, OfflineBanner, WeatherRiskWidget
│   ├── data/                            # Offline Static Knowledge Base
│   │   ├── diseases.json                # Complete 38+ Plant Classes with UR/EN/PS details
│   │   ├── crops.json                   # Supported Crop Metadata (Cotton, Wheat, Tomato, etc.)
│   │   └── localized_pesticides.json    # Pakistani Agrochemical Brand Directory (Nativo, Score, etc.)
│   ├── hooks/                           # Custom React Hooks
│   │   ├── useCamera.ts                 # Camera Stream, Flash & Capture Handler
│   │   ├── useEdgeClassifier.ts         # TF.js Model Loader & Real-time Inference Hook
│   │   ├── useSpeechSynthesis.ts        # Web Speech Audio Reader in Urdu/English/Pashto
│   │   ├── useOfflineSync.ts            # IndexedDB Background Sync Listener
│   │   └── useTranslation.ts            # Multilingual Localization Context Hook
│   ├── lib/                             # Core Libraries & Utilities
│   │   ├── db/                          # Dexie.js Client Database (`dexie.ts`)
│   │   ├── ml/                          # Preprocessing & TF.js Inference Engine (`classifier.ts`)
│   │   ├── i18n/                        # Translation dictionaries (Urdu, English, Pashto, Sindhi)
│   │   ├── utils.ts                     # Tailwind `cn()` helper & formatting utilities
│   │   └── prisma.ts                    # Prisma Client Singleton
│   └── types/                           # TypeScript Definitions
│       ├── crop.ts
│       ├── disease.ts
│       ├── scan.ts
│       └── i18n.ts
├── tailwind.config.ts                   # Tailwind Theme Customization
├── tsconfig.json                        # Strict TypeScript Config
├── package.json                         # Dependencies & Scripts
└── next.config.mjs                      # PWA & Webpack WASM Configuration
```

---

## 2. Phased Implementation Roadmap

### Phase 1: Project Scaffolding & Design Foundation
- **Goals:** Initialize Next.js 14/15, Tailwind CSS, Lucide icons, strict TypeScript, PWA config, and RTL multi-language support.
- **Tasks:**
  1. Initialize Next.js app with App Router and Tailwind CSS.
  2. Setup `@tailwindcss/typography` and Radix UI primitives.
  3. Create `src/lib/i18n/` with complete translations for **Urdu (`ur`), Pashto (`ps`), Sindhi (`sd`), and English (`en`)**.
  4. Create `RTLProvider` and `useTranslation` hook for seamless script direction switching.
  5. Setup Bottom Navigation Bar (`Home`, `Scan`, `Diary`, `Library`, `Advisory`).
- **Verification:** App boots cleanly on `localhost:3000`, language toggles between Urdu and English with proper RTL layout.

---

### Phase 2: Offline Knowledge Base & IndexedDB Storage
- **Goals:** Build the static 38+ disease dataset and configure Dexie.js IndexedDB client storage.
- **Tasks:**
  1. Populate `src/data/diseases.json` with 38+ PlantVillage & localized classes (Cotton CLCuV, Rice Blast, Wheat Rust, Tomato Early Blight, etc.) with Urdu names, organic remedies, and local chemical brands.
  2. Configure `src/lib/db/dexie.ts` for storing local scans, offline diary, and cached disease profiles.
  3. Create seed script `prisma/seed.ts` for database synchronization.
- **Verification:** Run Dexie database unit test; verify offline reads/writes of scans and disease profiles without internet.

---

### Phase 3: Client-Side Edge ML Engine (TensorFlow.js)
- **Goals:** Enable in-browser sub-second computer vision inference using WebAssembly / WebGL.
- **Tasks:**
  1. Configure `@tensorflow/tfjs` and `@tensorflow/tfjs-backend-wasm` / `@tensorflow/tfjs-backend-webgl`.
  2. Build `src/lib/ml/classifier.ts` with model loading, tensor warmup, image resizing to 224x224, and Softmax output calibration.
  3. Implement `useEdgeClassifier` hook with loading states, inference latency measurement, and fallback heuristic.
- **Verification:** Provide sample diseased tomato leaf image tensor; verify model outputs `Tomato___Early_blight` with $\ge 90\%$ confidence in $< 600$ms.

---

### Phase 4: Core Camera UI & Diagnostic Result Screen
- **Goals:** Build the primary camera viewfinder and the diagnosis result screen with audio narration.
- **Tasks:**
  1. Implement `CameraViewfinder` (`src/components/scanner/CameraViewfinder.tsx`) with stream acquisition, torch toggle, framing overlay, and gallery upload.
  2. Build `/scan/result` page displaying:
     - Health Status & Confidence Ring Meter
     - Urdu / English Audio Voice Readout (Web Speech API via `useSpeechSynthesis`)
     - Severity Tag (Low / Moderate / Severe)
     - Tabbed Remedy Panel: **🌿 Organic Remedy** vs **🧪 Chemical Treatment** (with local brands)
     - Interactive **⚖️ Spray Dosage Calculator** (Per Acre / Kanal -> Knapsack tank conversion)
  3. Enable 1-tap "Save to Field Diary".
- **Verification:** Capture photo via camera or file picker -> Result displays instantly with working Urdu audio speech narration.

---

### Phase 5: Field Diary & Offline Synchronization
- **Goals:** Provide a chronological scan log that works 100% offline and automatically syncs when online.
- **Tasks:**
  1. Build `/diary` page listing all past scans with thumbnail previews, crop badges, and sync pills.
  2. Implement `/diary/[id]` detailed report viewer with WhatsApp share functionality.
  3. Build `/api/sync/scans` endpoint and `useOfflineSync` hook to batch upload local records when connectivity resumes.
- **Verification:** Disconnect Wi-Fi -> Perform 3 scans -> Verify saved in Diary -> Reconnect Wi-Fi -> Verify background sync status changes to `Synced`.

---

### Phase 6: Disease Encyclopedia, Agronomist Bridge & Dosage Calculator
- **Goals:** Build the remaining high-impact features.
- **Tasks:**
  1. Build `/encyclopedia` searchable grid with crop category filtering.
  2. Build `/calculator` standalone tool for calculating chemical mixtures, tank water ratios, and fertilizer recommendations.
  3. Build `/advisory` page with direct 1-tap WhatsApp Agronomist Bridge (pre-formatting diagnostic reports for WhatsApp) and regional outbreak alert cards.
- **Verification:** Test search for "کپاس" (Cotton) and "Tomato"; test WhatsApp link generation with encoded diagnostic data.

---

### Phase 7: PWA Polish, Performance Audits & Edge Case Hardening
- **Goals:** Final optimization, offline manifest, Lighthouse $\ge 95$, and edge case testing.
- **Tasks:**
  1. Generate PWA icons (`192x192`, `512x512`), `manifest.json`, and Workbox Service Worker caching rules.
  2. Add low-light image warning and blur detection in viewfinder.
  3. Run Lighthouse performance, accessibility, and PWA audit.
- **Verification:** Run `npm run build` with zero TypeScript or lint errors; verify PWA install banner triggers in mobile Chrome.

---

## 3. Agent Step-by-Step Execution Protocol

```
+-------------------------------------------------------------------------------+
|                        AI AGENT EXECUTION RULES                               |
+-------------------------------------------------------------------------------+
| 1. ALWAYS read existing files before modifying.                               |
| 2. Maintain strict TypeScript types (NO 'any' types in core ML or DB code).   |
| 3. Ensure all user-facing strings are wrapped in i18n translation objects.    |
| 4. Test offline resilience by verifying IndexedDB fallbacks for every screen. |
| 5. Keep all button touch targets >= 48px for outdoor mobile usability.        |
+-------------------------------------------------------------------------------+
```
