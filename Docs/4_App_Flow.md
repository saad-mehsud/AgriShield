# 🗺️ App Flow, User Journeys & State Machine
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 1.0.0  
**Focus:** Complete navigation topology, state machines, offline handling, and multi-lingual user journeys.

---

## 1. Global Sitemap & Route Architecture

```
/ (Root)
│
├── /onboarding               -> Language Selection & Offline Engine Initialization
├── /home (Main Dashboard)    -> Hero Scanner, Weather Risk, Recent Scans, Quick Actions
│
├── /scan                     -> Live Camera Viewfinder & Image Picker
│   └── /scan/result          -> Diagnosis, Severity, Audio Readout, Organic/Chemical Remedies
│       └── /scan/dosage      -> Integrated Spray & Tank Volume Calculator
│
├── /diary                    -> Field History, Temporal Records & Offline Sync Manager
│   └── /diary/[id]           -> Historical Diagnostic Report Detail & Share
│
├── /encyclopedia             -> 38+ Plant Disease Offline Catalog & Search
│   └── /encyclopedia/[id]    -> Comprehensive Disease Profile & Prevention Manual
│
├── /calculator               -> Standalone Agricultural Chemical & Fertilizer Dosage Tool
│
├── /advisory                 -> Regional Outbreak Heatmap & 1-Tap Agronomist WhatsApp Bridge
│
└── /settings                 -> Language Preference, Offline Cache Management, App Version
```

---

## 2. End-to-End User Journey Walkthroughs

### 2.1 Journey 1: Offline Field Inspection with Urdu Audio (Bashir - Farmer)

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Bashir (Farmer in Field)
    participant UI as AgriShield PWA (Offline)
    participant EdgeML as In-Browser TF.js Model
    participant TTS as Web Speech Audio Engine
    participant DB as IndexedDB (Dexie)

    Farmer->>UI: Opens AgriShield PWA (No 4G/Internet)
    UI->>Farmer: Displays Dashboard in Urdu (کسان دوست)
    Farmer->>UI: Taps giant "پتے کا معائنہ کریں" (Scan Leaf)
    UI->>Farmer: Activates Live Camera with Leaf Guide
    Farmer->>UI: Points camera at diseased cotton leaf & taps Shutter
    UI->>EdgeML: Normalizes 224x224 RGB Tensor & Runs Inference
    EdgeML-->>UI: Returns { class: "Cotton___Leaf_Curl_Virus", confidence: 0.94 }
    UI->>DB: Saves Scan with base64 thumbnail & timestamp
    UI->>Farmer: Displays Diagnosis Card: "کپاس کے پتے کا مڑاؤ وائرس (94%)"
    Farmer->>UI: Taps "🔊 سنیں" (Listen Audio Button)
    UI->>TTS: Synthesizes Urdu Audio ("آپ کی کپاس کی فصل میں پتے کے مڑاؤ کا وائرس ہے...")
    TTS-->>Farmer: Speaks diagnosis & organic whitefly control steps aloud
    Farmer->>UI: Taps "دوائی کا حساب" (Dosage Calculator) for 3 Acres
    UI-->>Farmer: Displays exact 6 Knapsack tanks + 150ml Imidacloprid formula
```

---

### 2.2 Journey 2: Escalating to Agronomist via WhatsApp (Dr. Tariq)

```mermaid
flowchart TD
    A[Farmer receives Diagnosis Result] --> B{Is Confidence >= 85%?}
    B -- Yes --> C[Farmer views Localized Remedy & Dosage]
    B -- No / Uncertain --> D[App highlights 'Ask Agronomist' Button]
    D --> E[Farmer clicks 'Send to Agronomist on WhatsApp']
    E --> F[App automatically formats WhatsApp message with Image, Crop Name, Suspected Disease, GPS location]
    F --> G[Opens WhatsApp / WhatsApp Business with pre-filled report]
    G --> H[Agronomist replies with certified prescription]
```

---

## 3. Diagnostic State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> InitializingModel : App Launch
    InitializingModel --> Ready : Model Cached & Warmed Up
    InitializingModel --> ModelError : Load Failed (Fallback to API)

    Ready --> CameraActive : User Taps Scan
    Ready --> ImagePicker : User Selects Gallery File

    CameraActive --> Capturing : User Clicks Shutter
    ImagePicker --> Preprocessing : Image Loaded

    Capturing --> Preprocessing : Frame Rendered to Canvas
    Preprocessing --> Inferencing : Tensor [1, 224, 224, 3] Created

    Inferencing --> EvaluatingResult : Softmax Output Generated

    state EvaluatingResult {
        [*] --> CheckConfidence
        CheckConfidence --> HighConfidence : Confidence >= 75%
        CheckConfidence --> ModerateConfidence : Confidence 50% - 74%
        CheckConfidence --> LowConfidence : Confidence < 50%
    }

    HighConfidence --> DisplayResult : Show Exact Match & Audio
    ModerateConfidence --> DisplayResult : Show Top 2 Possibilities
    LowConfidence --> RetakePrompt : Prompt to Retake with Better Lighting

    RetakePrompt --> CameraActive : User Retries
    DisplayResult --> SavingHistory : Auto-Save to IndexedDB
    SavingHistory --> ActionCenter : View Organic/Chemical/Dosage
    ActionCenter --> [*]
```

---

## 4. Offline Synchronization State Machine

```mermaid
stateDiagram-v2
    [*] --> LocalStorage

    state LocalStorage {
        ScanCompleted --> WriteIndexedDB : Insert record (isSynced = false)
        WriteIndexedDB --> UpdateDiaryUI : Optimistic list update
    }

    UpdateDiaryUI --> CheckConnectivity : Network Status Check

    state CheckConnectivity {
        [*] --> Offline : navigator.onLine == false
        [*] --> Online : navigator.onLine == true
    }

    Offline --> ListenForOnlineEvent : Await Network Restoration
    ListenForOnlineEvent --> Online : 'online' event triggered

    Online --> BatchSync : Send all pending scans to /api/sync/scans
    BatchSync --> MarkSynced : Server returns 200 OK
    MarkSynced --> WriteIndexedDB : Update record (isSynced = true)
    BatchSync --> RetryBackoff : Network drops mid-sync
    RetryBackoff --> ListenForOnlineEvent
```

---

## 5. Screen Navigation & Transition Matrix

| Current Screen | User Action | Target Screen | Transition Animation | Fallback / Edge Case |
| :--- | :--- | :--- | :--- | :--- |
| **Splash / Onboarding** | Select Language & Tap Start | `/home` | Slide Left | Auto-detect device language if skipped |
| **Home Dashboard** | Tap Camera CTA | `/scan` | Zoom In | If camera permission denied, opens Gallery selector |
| **Home Dashboard** | Tap Recent Scan Card | `/diary/[id]` | Fade In | Opens cached scan from IndexedDB |
| **Camera Viewfinder** | Tap Shutter Button | `/scan/result` | Shutter Flash + Slide Up | If blur detected, shows stability warning |
| **Camera Viewfinder** | Tap Gallery Icon | Native File Picker | Modal Overlay | Formats JPEG/PNG/WebP automatically |
| **Diagnosis Result** | Tap "Dosage Calculator" | `/scan/result#dosage`| Tab Fade | Defaults to 1 Acre knapsack calculation |
| **Diagnosis Result** | Tap "Save & Finish" | `/diary` | Slide Right | Background syncs if online |
| **Encyclopedia** | Tap any Crop / Disease | `/encyclopedia/[id]`| Slide Left | 100% available offline from local JSON cache |
| **Global Nav** | Tap Offline Status Pill | `/settings` | Modal Pop-up | Displays storage quota and sync queue count |

---

## 6. Error & Edge Case Resolution Flows

```
+-----------------------------+-------------------------------------------------------------+
| Edge Case Scenario          | Graceful Recovery Flow                                      |
+-----------------------------+-------------------------------------------------------------+
| 1. Camera Access Blocked    | Display clear illustration + "Enable Camera" guide. Offer   |
|                             | instant "Upload Photo from Gallery" fallback button.       |
| 2. Low Light / Dark Leaf    | Auto-prompt: "⚠️ Image too dark. Please enable flash or     |
|                             | move to a brighter spot."                                   |
| 3. Blurry / Non-Leaf Image  | Model outputs low entropy score across all plant classes.   |
|                             | Prompt: "🌿 Leaf not detected. Please capture a clear leaf."|
| 4. Device WebGL Unsupported | TF.js automatically falls back to WASM / CPU backend with  |
|                             | graceful performance degradation message.                   |
| 5. Offline Storage Limit    | IndexedDB stores up to 1GB+ without issue; auto-compresses  |
|                             | thumbnails to < 20KB for endless diary logs.                |
+-----------------------------+-------------------------------------------------------------+
```
