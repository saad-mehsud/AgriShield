# 🗺️ App Flow, User Journeys & State Machine
## Project: AgriShield (کسان دوست) — AI Crop Disease Diagnostics & Explainable Decision Support System

**Document Version:** 4.0.0 (Custom PyTorch ML + Explainable AI Edition)  
**Focus:** FastAPI API request flows, PyTorch & Grad-CAM pipeline, sequence diagrams, state machines, and multi-lingual user journeys.

---

## 1. Global Sitemap & Route Architecture

```
Frontend Web Client (Next.js / React)
│
├── /onboarding               -> Language Selection & Setup
├── / (Main Dashboard)        -> Hero Scanner, Weather Risk, Recent Scans, Quick Actions
│
├── /scan                     -> Camera Viewfinder & Image Upload Screen
│   └── /scan/result          -> Diagnosis Report, Grad-CAM Heatmap, Urdu Voice Player, Remedies & Dosage
│
├── /diary                    -> Field History & Historical Scan Records
│   └── /diary/[id]           -> Individual Diagnostic Report Detail & WhatsApp Share
│
├── /encyclopedia             -> Crop Disease Catalog & Search
│   └── /encyclopedia/[id]    -> Disease Profile, Pathology & Preventive Manual
│
├── /calculator               -> Standalone Spray Dosage Tool (Acre / Kanal / Marla)
│
└── /advisory                 -> Regional Outbreak Advisory & 1-Tap Agronomist WhatsApp Bridge

Backend Server (Python FastAPI)
│
├── /docs                     -> Interactive Swagger / OpenAPI Documentation
├── /api/diagnose             -> Image Ingestion, PyTorch Classification & Grad-CAM Heatmap Gen
├── /api/diseases             -> Disease Knowledge Base & Remedies Endpoint
├── /api/scans                -> Field Diary Scans Endpoint
└── /api/weather/alerts       -> Live Weather Risk Alert Endpoint
```

---

## 2. End-to-End User Journey Sequence Diagram

### 2.1 Complete Diagnostic & Grad-CAM Heatmap Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Bashir (Farmer)
    participant WebUI as Frontend Web Client (React/Next)
    participant FastAPI as Python FastAPI Backend (/api)
    participant PyTorch as PyTorch ML Service (MobileNetV3)
    participant GradCAM as Explainable AI (Grad-CAM Engine)
    participant DB as SQLite / PostgreSQL (SQLAlchemy)
    participant TTS as Browser Web Speech Engine

    Farmer->>WebUI: Opens AgriShield Web App in Mobile Browser
    WebUI->>Farmer: Renders Dashboard in Urdu (کسان دوست)
    Farmer->>WebUI: Taps "پتے کا معائنہ کریں" (Take Photo / Upload)
    Farmer->>WebUI: Captures diseased leaf photo
    WebUI->>FastAPI: Multipart POST /api/diagnose (image file, GPS)
    FastAPI->>PyTorch: TorchVision 224x224 RGB Normalize & Forward Pass
    PyTorch-->>FastAPI: Output: "Tomato___Early_blight" (Confidence: 96.8%, Time: 24ms)
    FastAPI->>GradCAM: Hook final conv layer -> Compute gradients -> Generate Heatmap
    GradCAM-->>FastAPI: Heatmap Overlay WebP Generated (Time: 38ms)
    FastAPI->>DB: Query Pakistani remedies (Syngenta/Bayer), Desi Totkay & save Scan
    DB-->>FastAPI: Return enriched disease & dosage record
    FastAPI-->>WebUI: Responds with 200 OK (Full Diagnosis + Heatmap URL)
    WebUI->>Farmer: Renders Diagnosis Screen with Grad-CAM Toggle
    Farmer->>WebUI: Toggles "🔥 AI Lesion Heatmap" to see infected spots
    Farmer->>WebUI: Taps "🔊 سنیں" (Listen Audio Button)
    WebUI->>TTS: Synthesizes Urdu Audio ("آپ کے ٹماٹر کے پودے میں اگیتا جھلسائو ہے...")
    TTS-->>Farmer: Speaks diagnostic findings & spray instructions aloud
    Farmer->>WebUI: Selects 3 Acres in Dosage tab
    WebUI-->>Farmer: Displays 15 Knapsack Tanks (20L) & 750g Mancozeb requirement
```

---

## 3. Diagnostic State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> CameraActive : User Opens Camera
    Idle --> FilePicker : User Selects Gallery Upload

    CameraActive --> ImageReady : User Snaps Photo
    FilePicker --> ImageReady : User Chooses File

    ImageReady --> ProcessingML : Submits POST /api/diagnose

    state ProcessingML {
        [*] --> IngestBytes
        IngestBytes --> PyTorchInference : MobileNetV3 Forward Pass
        PyTorchInference --> GradCAMGeneration : Compute Backward Activation Gradients
        GradCAMGeneration --> DatabaseEnrichment : Map Local Brands & Desi Totkay
    }

    ProcessingML --> Success : HTTP 200 OK Received (Latency < 300ms)
    ProcessingML --> NetworkError : Server Error / Timeout

    state Success {
        [*] --> CheckConfidence
        CheckConfidence --> HighConfidence : Confidence >= 75%
        CheckConfidence --> ModerateConfidence : Confidence 50% - 74%
        CheckConfidence --> LowConfidence : Confidence < 50%
    }

    HighConfidence --> RenderDiagnosis : Display Match + Grad-CAM Heatmap + Audio
    ModerateConfidence --> RenderDiagnosis : Display Top 2 Probabilities
    LowConfidence --> RetakeSuggestion : Suggest Clearer Photo / Lighting

    NetworkError --> RetryPrompt : Display "Error - Tap to Retry"
    RetryPrompt --> ImageReady : User Retries

    RenderDiagnosis --> [*]
```

---

## 4. Screen Navigation & Transition Matrix

| Current Screen | User Action | Target Screen | Transition Effect | Error / Edge Case Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **Home Dashboard** | Tap Camera / Upload CTA | `/scan` | Zoom In | If camera unavailable, opens file picker directly |
| **Camera View** | Snap Photo / Select File | `/scan/result` | Slide Up | Instant loading skeleton during 300ms inference |
| **Diagnosis Screen** | Tap "Grad-CAM Toggle" | Current View | Crossfade Image | Switches between raw leaf and lesion heatmap |
| **Diagnosis Screen** | Tap "Dosage Calculator" | `/scan/result#dosage`| Tab Switch | Auto-calculates for 1 Acre default |
| **Diagnosis Screen** | Tap "WhatsApp Agronomist"| Native WhatsApp | Deep Link | Encodes diagnosis summary into WhatsApp text |
| **Navigation Bar** | Tap "Field Diary" | `/diary` | Instant Fade | Fetches scan history from `GET /api/scans` |
| **Encyclopedia** | Tap any Disease Card | `/encyclopedia/[id]` | Slide Left | Fetches disease profile from `GET /api/diseases/[id]` |
