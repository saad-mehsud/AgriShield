# 🗺️ App Flow, User Journeys & State Machine
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 3.0.0 (Python FastAPI Architecture)  
**Focus:** FastAPI API request flows, sequence diagrams, state machines, and multi-lingual user journeys.

---

## 1. Global Sitemap & Route Architecture

```
Frontend Web Client (Next.js / React)
│
├── /onboarding               -> Language Selection & Onboarding
├── / (Main Dashboard)        -> Hero Scanner, Weather Risk, Recent Scans, Quick Actions
│
├── /scan                     -> Camera Viewfinder & Image Upload Screen
│   └── /scan/result          -> Diagnosis Report, Urdu Voice Player, Remedies & Dosage
│
├── /diary                    -> Cloud Field History & Historical Scan Records
│   └── /diary/[id]           -> Individual Diagnostic Report Detail & WhatsApp Share
│
├── /encyclopedia             -> 38+ Plant Disease Catalog & Search
│   └── /encyclopedia/[id]    -> Disease Profile, Pathology & Preventive Manual
│
├── /calculator               -> Standalone Agricultural Chemical & Spray Dosage Tool
│
└── /advisory                 -> Regional Outbreak Advisory & 1-Tap Agronomist WhatsApp Bridge

Backend Server (Python FastAPI)
│
├── /docs                     -> Interactive Swagger / OpenAPI Documentation
├── /api/v1/diagnose          -> Multipart Image Ingestion & PyTorch ML Classification
├── /api/v1/diseases          -> Disease Knowledge Base & Remedies Endpoint
├── /api/v1/scans             -> Field Diary Scans Endpoint
└── /api/v1/weather/alerts    -> Live Weather Risk Alert Endpoint
```

---

## 2. End-to-End User Journey Sequence Diagram

### 2.1 Cloud Field Diagnosis with Urdu Voice Output

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Bashir (Farmer)
    participant WebUI as Frontend Web Client (React/Next)
    participant FastAPI as Python FastAPI Backend (/api/v1)
    participant PyTorch as PyTorch ML Service (MobileNetV2)
    participant DB as SQLite / PostgreSQL (SQLAlchemy)
    participant TTS as Browser Web Speech Engine

    Farmer->>WebUI: Opens AgriShield Web App in Mobile Browser
    WebUI->>Farmer: Renders Dashboard in Urdu (کسان دوست)
    Farmer->>WebUI: Taps "پتے کا معائنہ کریں" (Take Photo / Upload)
    Farmer->>WebUI: Captures diseased leaf photo
    WebUI->>WebUI: Displays Animated Laser Scanner ("فاسٹ اے پی آئی پر معائنہ ہو رہا ہے...")
    WebUI->>FastAPI: Multipart POST /api/v1/diagnose (image file, cropHint, GPS)
    FastAPI->>PyTorch: Resize 224x224 RGB, TorchVision normalize & Softmax inference
    PyTorch-->>FastAPI: Returns { class_key: "Tomato___Early_blight", confidence: 0.965 }
    FastAPI->>DB: Queries localized remedies, chemical brands & saves Scan record
    DB-->>FastAPI: Returns enriched disease & dosage record
    FastAPI-->>WebUI: Responds with 200 OK (Full Diagnosis JSON)
    WebUI->>Farmer: Renders Diagnosis Screen: "ٹماٹر - اگیتا جھلسائو (96%)"
    Farmer->>WebUI: Taps "🔊 سنیں" (Listen Audio Button)
    WebUI->>TTS: Synthesizes Urdu Audio ("آپ کے ٹماٹر کے پودے میں اگیتا جھلسائو ہے...")
    TTS-->>Farmer: Speaks diagnostic findings & spray instructions aloud
    Farmer->>WebUI: Adjusts field area to 2 Acres in Dosage tab
    WebUI-->>Farmer: Re-calculates 10 Knapsack Tanks & 500g Mancozeb requirement
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

    ImageReady --> SubmittingToFastAPI : Submits POST /api/v1/diagnose

    state SubmittingToFastAPI {
        [*] --> SendingMultipart
        SendingMultipart --> ServerProcessing : Bytes Ingested by FastAPI
        ServerProcessing --> PyTorchInference : Tensor Evaluation (torch.no_grad)
        PyTorchInference --> DatabaseLookup : Fetch Localized Remedies & Brands
    }

    SubmittingToFastAPI --> Success : HTTP 200 OK Received
    SubmittingToFastAPI --> NetworkError : Connection Timeout / Server Error

    state Success {
        [*] --> CheckConfidence
        CheckConfidence --> HighConfidence : Confidence >= 75%
        CheckConfidence --> ModerateConfidence : Confidence 50% - 74%
        CheckConfidence --> LowConfidence : Confidence < 50%
    }

    HighConfidence --> RenderDiagnosis : Display Top Match + Remedies
    ModerateConfidence --> RenderDiagnosis : Display Top 2 Probabilities
    LowConfidence --> RetakeSuggestion : Suggest Clearer Photo / Lighting

    NetworkError --> RetryPrompt : Display "Network Error - Retry Upload"
    RetryPrompt --> ImageReady : User Taps Retry

    RenderDiagnosis --> [*]
```

---

## 4. Screen Navigation & Transition Matrix

| Current Screen | User Action | Target Screen | Transition Effect | Error / Edge Case Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **Home Dashboard** | Tap Camera / Upload CTA | `/scan` | Zoom In | If camera unavailable, opens file picker directly |
| **Camera View** | Snap Photo / Select File | `/scan` (Analyzing State) | Laser Scan Pulse | Upload progress indicator with cancel option |
| **Analyzing State** | FastAPI Response Success | `/scan/result` | Smooth Slide Up | If network drops, prompt 1-tap retry |
| **Diagnosis Screen** | Tap "Dosage Calculator" | `/scan/result#dosage` | Tab Switch | Auto-calculates for 1 Acre default |
| **Diagnosis Screen** | Tap "WhatsApp Agronomist" | Native WhatsApp Web/App | Deep Link | Encodes diagnosis summary into WhatsApp text |
| **Navigation Bar** | Tap "Field Diary" | `/diary` | Instant Fade | Fetches scan history from `GET /api/v1/scans` |
| **Encyclopedia** | Tap any Disease Card | `/encyclopedia/[id]` | Slide Left | Fetches disease profile from `GET /api/v1/diseases/[id]` |
