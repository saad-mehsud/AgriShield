# 🚀 Agent Implementation Plan (7-Day Hackathon Roadmap)
## Project: AgriShield (کسان دوست) — AI Crop Disease Diagnostics & Explainable Decision Support System

**Document Version:** 4.0.0 (Custom PyTorch ML + Explainable AI Edition)  
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
├── backend/                              # Python FastAPI + PyTorch ML Cloud Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                       # FastAPI App Entrypoint & CORS Middleware
│   │   ├── config.py                     # Environment Configuration
│   │   ├── database.py                   # SQLAlchemy Engine & SessionLocal
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py                 # SQLAlchemy ORM Models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py                # Pydantic v2 Request/Response Schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── diagnose.py               # `POST /api/v1/diagnose` Route (ML + Grad-CAM)
│   │   │   ├── diseases.py               # `GET /api/v1/diseases` Route
│   │   │   ├── scans.py                  # `GET /api/v1/scans` Route
│   │   │   └── weather.py                # `GET /api/v1/weather/alerts` Route
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ml_service.py             # PyTorch MobileNetV3 Vision Classifier
│   │   │   ├── gradcam_service.py        # Explainable AI (Grad-CAM Heatmap Generator)
│   │   │   └── storage_service.py        # Pillow Image & Thumbnail Saver
│   │   └── seeds/
│   │       ├── __init__.py
│   │       ├── seed_data.py              # 38+ Plant Classes & Pakistani Remedies Seed
│   │       └── diseases_data.json        # Static JSON dataset of localized remedies
│   ├── models_weights/                   # Serialized PyTorch Model Checkpoints (.pth / .onnx)
│   ├── static/                           # Static File Hosting
│   │   └── uploads/
│   │       ├── scans/                    # Original Leaf Images
│   │       ├── heatmaps/                 # Grad-CAM Visual Heatmap Overlays
│   │       └── thumbnails/               # Compressed Thumbnails
│   ├── requirements.txt                  # Python Dependencies (fastapi, torch, torchvision, opencv)
│   └── Dockerfile                        # Backend Container Definition
│
└── frontend/                             # Next.js / React Client Web Application
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
    │   │   │       └── page.tsx          # Diagnosis Report, Grad-CAM Toggle & Remedy Tabs
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
    │   │   ├── scanner/                  # CameraViewfinder, ShutterButton, UploadDropzone
    │   │   ├── diagnosis/                # DiagnosisCard, GradCamViewer, AudioPlayer, RemedyTabs, DosageCalculator
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

## 2. 7-Day Hackathon Phased Execution Plan

### Day 1: FastAPI Backend Setup & Pakistani Agronomic Knowledge Seeding
- **Tasks:**
  1. Create `backend/requirements.txt` (`fastapi`, `uvicorn`, `torch`, `torchvision`, `opencv-python-headless`, `sqlalchemy`, `pydantic`, `pillow`, `python-multipart`).
  2. Implement `backend/app/database.py` and `backend/app/models/models.py`.
  3. Seed database with 38+ crop disease profiles, Urdu/Pashto names, certified Pakistani agrochemical brands (*Nativo, Score, Ridomil Gold, Movento*), and "Desi Totkay" organic remedies.
  4. Verify database creation and FastAPI Swagger UI at `http://localhost:8000/docs`.

---

### Day 2: PyTorch Model Loading & Grad-CAM Explainable AI Service
- **Tasks:**
  1. Build `backend/app/services/ml_service.py` with TorchVision transforms and MobileNetV3-Large classification model.
  2. Implement `backend/app/services/gradcam_service.py` to hook into the final convolutional layer (`features[-1]`), compute backward gradients, and render Jet colormap overlays onto the leaf image.
  3. Implement `backend/app/services/storage_service.py` to save original leaf photos, Grad-CAM heatmaps, and compressed thumbnails.
- **Verification:** Unit test with a test tomato early blight image tensor; verify prediction outputs in $< 30$ms and Grad-CAM heatmap generates correctly.

---

### Day 3: Diagnostic Endpoint (`POST /api/v1/diagnose`) & Backend Testing
- **Tasks:**
  1. Build `backend/app/routers/diagnose.py` combining multipart image ingestion, PyTorch prediction, Grad-CAM heatmap generation, and database remedy enrichment.
  2. Implement `backend/app/routers/diseases.py` and `backend/app/routers/scans.py`.
  3. Set up CORS middleware allowing requests from `http://localhost:3000`.
- **Verification:** Execute curl multipart request; verify response returns JSON containing `scan_id`, `image_url`, `heatmap_url`, confidence, Urdu remedy text, and dosage parameters.

---

### Day 4: Frontend Scaffolding, Sunlight Theme & Urdu/Pashto Audio
- **Tasks:**
  1. Initialize Next.js frontend with Tailwind CSS, Lucide React, and strict TypeScript.
  2. Implement `src/lib/i18n/` with translation dictionaries for **Urdu (`ur`), Pashto (`ps`), Sindhi (`sd`), and English (`en`)**.
  3. Create `RTLProvider` and `useSpeechSynthesis` hook for Urdu voice readout.
  4. Build Header and Bottom Navigation Bar.
- **Verification:** App boots on `localhost:3000`; language toggles between Urdu and English with instant RTL layout mirroring and working audio synthesis.

---

### Day 5: Camera Viewfinder UI & Grad-CAM Heatmap Inspection Screen
- **Tasks:**
  1. Implement `CameraViewfinder.tsx` with live HTML5 video stream, framing guide, torch toggle, and file picker fallback.
  2. Build `/scan/result` page displaying:
     - Health Status, Confidence Ring Gauge & Inference Latency Badge (`24ms CPU`).
     - **Explainable AI (Grad-CAM) Visual Switcher:** `[ 📷 Original ]` ⟷ `[ 🔥 AI Heatmap ]`.
     - Urdu Voice Readout Bar (`🔊 سنیں`).
     - Tabbed Remedy Panel: **🌿 Desi Totkay (Organic)** vs **🧪 Pakistani Brands (Chemical)**.
- **Verification:** Take photo -> View diagnosis -> Toggle Grad-CAM heatmap to inspect leaf lesions -> Tap audio button to hear Urdu speech narration.

---

### Day 6: Pakistani Land Unit Dosage Calculator, Field Diary & WhatsApp Bridge
- **Tasks:**
  1. Implement Pakistani Land Unit Dosage Calculator supporting **Acres (ایکڑ)**, **Kanals (کنال)**, and **Marlas (مرلہ)** converted into standard 16L/20L knapsack battery tanks.
  2. Build `/diary` page listing historical scans with thumbnails and Grad-CAM heatmap previews.
  3. Build `/encyclopedia` searchable disease catalog.
  4. Implement 1-tap WhatsApp Agronomist Bridge with pre-encoded diagnostic summaries.
- **Verification:** Calculate dosage for 2.5 Acres -> Verify tank count; share diagnostic report via WhatsApp link.

---

### Day 7: Fullstack End-to-End Verification, Performance & Pitch Polish
- **Tasks:**
  1. Perform end-to-end integration testing between frontend and FastAPI backend.
  2. Verify sub-300ms total round-trip response time.
  3. Prepare hackathon live demo walk-through script and pitch deck slides emphasizing $0 API cost and Explainable AI.
- **Verification:** Zero TypeScript or Python errors; smooth live camera demo workflow.
