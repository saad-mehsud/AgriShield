# 🚀 Agent Implementation Plan (Vibecoding Roadmap)
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 3.0.0 (Python FastAPI + React/Next.js Architecture)  
**Target Audience:** AI Coding Agents & Pair-Programming Engineers  
**Execution Strategy:** Step-by-Step Autonomous Phases with Continuous Verification & Acceptance Criteria.

---

## 1. Project Directory & File Tree Structure

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
│
├── backend/                              # Python FastAPI Cloud Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                       # FastAPI App Entrypoint & CORS Middleware
│   │   ├── config.py                     # Environment Variables & Settings
│   │   ├── database.py                   # SQLAlchemy Engine & SessionLocal
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py                 # SQLAlchemy ORM Models (Crops, Diseases, Scans)
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py                # Pydantic v2 Request/Response Models
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── diagnose.py               # `POST /api/v1/diagnose` Route
│   │   │   ├── diseases.py               # `GET /api/v1/diseases` Route
│   │   │   ├── scans.py                  # `GET/POST /api/v1/scans` Route
│   │   │   └── weather.py                # `GET /api/v1/weather/alerts` Route
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ml_service.py             # PyTorch MobileNetV2 Vision Model & Transforms
│   │   │   └── storage_service.py        # Pillow Image & Thumbnail Generation
│   │   └── seeds/
│   │       ├── __init__.py
│   │       ├── seed_data.py              # 38+ Plant Classes & Pakistani Remedies Seed
│   │       └── diseases_data.json        # Static JSON dataset of localized remedies
│   ├── models_weights/                   # Pre-trained PyTorch Model Weights (.pth / .onnx)
│   ├── static/                           # Static File Hosting
│   │   └── uploads/                      # Leaf Scans & Thumbnails
│   ├── requirements.txt                  # Python Dependencies (fastapi, torch, pillow, sqlalchemy)
│   └── Dockerfile                        # Backend Container Definition
│
└── frontend/                             # Next.js / React Client Application
    ├── public/
    │   └── icons/                        # Visual Badges & Favicons
    ├── src/
    │   ├── app/                          # Next.js App Router Pages
    │   │   ├── layout.tsx                # Root Layout with Fonts & RTL Provider
    │   │   ├── page.tsx                  # Main Dashboard / Home Page
    │   │   ├── onboarding/
    │   │   │   └── page.tsx              # Language Selection Screen
    │   │   ├── scan/
    │   │   │   ├── page.tsx              # Camera Viewfinder & Image Upload UI
    │   │   │   └── result/
    │   │   │       └── page.tsx          # Diagnosis Report, Audio & Remedy Tabs
    │   │   ├── diary/
    │   │   │   ├── page.tsx              # Field History & Scan Archive
    │   │   │   └── [id]/
    │   │   │       └── page.tsx          # Historical Scan Detail & WhatsApp Share
    │   │   ├── encyclopedia/
    │   │   │   ├── page.tsx              # 38+ Disease Catalog & Search
    │   │   │   └── [id]/
    │   │   │       └── page.tsx          # Disease Profile & Prevention Guide
    │   │   ├── calculator/
    │   │   │   └── page.tsx              # Standalone Spray Dosage & Tank Calculator
    │   │   └── advisory/
    │   │       └── page.tsx              # Outbreak Advisory & WhatsApp Agronomist Bridge
    │   ├── components/                   # Modular UI Components
    │   │   ├── layout/                   # Navbar, Header, RTLProvider
    │   │   ├── scanner/                  # CameraViewfinder, ShutterButton, LaserScanner
    │   │   ├── diagnosis/                # DiagnosisCard, AudioPlayer, RemedyTabs, DosageCalculator
    │   │   ├── diary/                    # ScanHistoryCard, FilterBar
    │   │   ├── encyclopedia/             # DiseaseCard, CropFilterPill, SearchInput
    │   │   └── ui/                       # Button, Card, Badge, Modal, Tabs, Slider
    │   ├── hooks/                        # Custom React Hooks
    │   │   ├── useCamera.ts              # HTML5 MediaDevices Camera Stream
    │   │   ├── useSpeechSynthesis.ts     # Web Speech Audio Reader in Urdu/English/Pashto
    │   │   └── useTranslation.ts         # Multilingual Localization Context Hook
    │   ├── lib/                          # Client API Utilities & i18n
    │   │   ├── api.ts                    # Axios / Fetch client targeting FastAPI Backend
    │   │   ├── i18n/                     # Translation dictionaries (Urdu, English, Pashto, Sindhi)
    │   │   └── utils.ts                  # Tailwind `cn()` helper
    │   └── types/                        # TypeScript Definitions
    ├── tailwind.config.ts                # Tailwind Theme Customization
    ├── tsconfig.json                     # Strict TypeScript Config
    └── package.json                      # Frontend Dependencies & Scripts
```

---

## 2. Phased Implementation Roadmap

### Phase 1: Python FastAPI Scaffolding, Database & 38+ Disease Seeding
- **Goals:** Set up Python virtual environment, FastAPI server, SQLite/PostgreSQL database via SQLAlchemy, and seed the localized disease knowledge base.
- **Tasks:**
  1. Initialize `backend/requirements.txt` with `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `torch`, `torchvision`, `pillow`, `python-multipart`.
  2. Implement `backend/app/database.py` and `backend/app/models/models.py`.
  3. Create `backend/app/seeds/seed_data.py` to populate 38+ plant diseases, symptoms, organic cures, and Pakistani chemical brands (*Nativo, Score, Ridomil Gold*).
  4. Build `backend/app/main.py` with CORS middleware and database initialization on startup.
- **Verification:** Run `uvicorn app.main:app --reload` on port `8000`. Navigate to `http://localhost:8000/docs`; verify Swagger UI loads and database contains seeded diseases.

---

### Phase 2: PyTorch ML Inference Service & `/api/v1/diagnose` Route
- **Goals:** Build the server-side image preprocessing, deep learning classification pipeline, and the primary diagnosis endpoint.
- **Tasks:**
  1. Implement `backend/app/services/ml_service.py` with TorchVision transforms, pre-trained MobileNetV2 architecture, and Softmax output.
  2. Implement `backend/app/services/storage_service.py` to save images and generate `150x150` WebP thumbnails using Pillow.
  3. Build `backend/app/routers/diagnose.py` accepting multipart image uploads, executing inference, querying the database for matching remedies, creating a `DiagnosticScan` record, and returning structured JSON.
- **Verification:** Run a test curl request with a sample tomato leaf image to `POST http://localhost:8000/api/v1/diagnose`. Verify response returns `Tomato___Early_blight` with confidence score and Urdu remedy texts in $< 1.0$s.

---

### Phase 3: Frontend Web Scaffolding & Localization System
- **Goals:** Set up Next.js/React frontend with Tailwind CSS, Lucide icons, strict TypeScript, and RTL multi-language engine.
- **Tasks:**
  1. Initialize Next.js project in `frontend/` with App Router, Tailwind CSS, and Lucide React.
  2. Create `src/lib/i18n/` with complete translations for **Urdu (`ur`), Pashto (`ps`), Sindhi (`sd`), and English (`en`)**.
  3. Create `RTLProvider` and `useTranslation` hook for dynamic script direction and font switching (`Inter` vs `Noto Nastaliq Urdu`).
  4. Build Header and Bottom Navigation Bar.
- **Verification:** Frontend runs on `localhost:3000`; language toggles between Urdu and English with instant RTL layout mirroring.

---

### Phase 4: Camera Viewfinder UI, Laser Scanning Upload & Diagnosis Screen
- **Goals:** Implement HTML5 camera capture, animated cloud scanning loading transition, and the rich diagnosis presentation screen with Urdu voice audio.
- **Tasks:**
  1. Build `CameraViewfinder.tsx` with live camera video stream, shutter button, framing overlay, and gallery upload button.
  2. Build `LaserScanner.tsx` showing the animated scanning line and FastAPI progress stepper.
  3. Implement `/scan/result` page displaying:
     - Health Status & Confidence Ring Gauge.
     - Urdu / English Audio Voice Readout (`useSpeechSynthesis`).
     - Severity Tag (Low / Moderate / Severe).
     - Tabbed Remedy Panel: **🌿 Organic Remedy** vs **🧪 Chemical Treatment** (with local brands).
     - Interactive **⚖️ Spray Dosage Calculator** (Per Acre / Kanal -> Knapsack tank conversion).
- **Verification:** Snap photo in browser -> Watch animated laser scan -> View diagnosis card -> Tap "سنیں" to hear Urdu speech narration.

---

### Phase 5: Field Diary & Scan History (`/diary`)
- **Goals:** Centralized historical scan viewer connected to FastAPI backend.
- **Tasks:**
  1. Implement `backend/app/routers/scans.py` for `GET /api/v1/scans` and `GET /api/v1/scans/{id}`.
  2. Build `frontend/src/app/diary/page.tsx` displaying chronological card grid with crop filters.
  3. Build `frontend/src/app/diary/[id]/page.tsx` for individual scan review and 1-click WhatsApp share.
- **Verification:** Perform 3 scans -> Verify all 3 appear in Diary with accurate thumbnails and timestamps.

---

### Phase 6: Disease Encyclopedia, Spray Dosage Calculator & WhatsApp Bridge
- **Goals:** Build the remaining high-impact features.
- **Tasks:**
  1. Implement `backend/app/routers/diseases.py` and `frontend/src/app/encyclopedia/page.tsx` with search and crop filter chips.
  2. Build `/calculator` standalone tool for calculating chemical mixtures, tank water ratios, and fertilizer recommendations.
  3. Build `/advisory` page with direct 1-tap WhatsApp Agronomist Bridge (pre-formatting diagnostic reports for WhatsApp) and regional outbreak alert cards.
- **Verification:** Search for "کپاس" (Cotton) in Encyclopedia; test WhatsApp URL generation with encoded diagnostic data.

---

### Phase 7: Fullstack End-to-End Polish & Verification
- **Goals:** System integration, performance audits, and error boundary hardening.
- **Tasks:**
  1. Verify CORS communication between `localhost:3000` (frontend) and `localhost:8000` (FastAPI backend).
  2. Add network error retry dialogs in frontend.
  3. Verify responsive layout on mobile Chrome and desktop browsers.
- **Verification:** Run `pytest` on backend and `npm run build` on frontend with zero errors.
