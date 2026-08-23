# 🌾 Product Requirements Document (PRD)
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 3.0.0 (Python FastAPI + React/Next.js Cloud Architecture)  
**Status:** Approved for Implementation (Vibecoding)  
**Target Platform:** Web Application (Mobile-Optimized & Desktop Responsive)  
**Primary Region:** Pakistan & South Asian Agro-zones (Universal applicability for global crops)  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
To empower farmers and agronomists with an instant, cloud-based AI plant doctor. The farmer snaps or uploads a photo of a diseased plant leaf via a mobile-friendly web client. The image is transmitted to a high-performance **Python FastAPI** backend running native deep learning computer vision models (PyTorch / TorchVision). The server returns sub-second diagnosis, severity assessment, dual organic/chemical treatment advice with local brand names, precise spray dosage calculations, and localized voice audio guidance in Urdu, Pashto, Sindhi, and English.

### 1.2 The Core Problem & Solution
Agricultural diseases cause over **PKR 345B – PKR 523B** in annual losses across Pakistan due to delayed identification and blind chemical overuse.

By powering the backend with **Python FastAPI + PyTorch**:
- **Native ML Ecosystem:** Leverages the full power of Python's scientific computing stack (PyTorch, TorchVision, NumPy, Pillow, OpenCV) without translation layers.
- **High-Performance Asynchronous I/O:** FastAPI provides asynchronous request handling, auto-generated OpenAPI documentation (`/docs`), and sub-second classification response times.
- **Zero Client Memory Overhead:** Lightweight frontend runs smoothly on low-spec mobile browsers while heavy neural network computations remain on the cloud GPU/CPU.
- **Centralized Agronomic Intelligence:** Every diagnosis is logged into a central relational database to support regional outbreak heatmaps and agronomist validation.

---

## 2. Target User Personas

### Persona 1: Bashir Ahmed (Smallholder Farmer - Primary User)
- **Location:** Rahim Yar Khan, Punjab (Cotton & Wheat)
- **Device:** Budget Android Smartphone (Chrome Browser)
- **Goal:** Takes a photo of diseased cotton leaves; receives instant Urdu voice readout with exact pesticide mixture instructions for his 3-acre field.

### Persona 2: Dr. Tariq Mahmood (Agricultural Extension Officer)
- **Location:** Tandojam, Sindh
- **Device:** Tablet / Laptop
- **Goal:** Reviews centralized farmer diagnosis logs, monitors disease trends, and verifies active ingredient prescriptions.

### Persona 3: Farhan Malik (Commercial Farm Manager)
- **Location:** Multan / Faisalabad
- **Device:** iPhone / Desktop
- **Goal:** High-volume field inspections, precise spray dosage calculations per acre, chemical vs. organic cost-benefit analysis.

---

## 3. Vulnerable Crops & Pathogen Coverage

| Crop Category | Target Crops | Primary Diseases / Pathogens | Typical Yield Loss |
| :--- | :--- | :--- | :--- |
| **Cash Crops** | Cotton, Sugarcane | Cotton Leaf Curl Virus (CLCuV), Bacterial Blight, Root Rot, Red Rot | 30% – 60% |
| **Cereal & Grains** | Wheat, Rice, Corn (Maize) | Yellow/Brown Rust, Rice Blast, Brown Spot, Northern Leaf Blight | 20% – 45% |
| **Vegetables** | Tomato, Potato, Pepper | Early Blight, Late Blight, Tomato Yellow Leaf Curl, Bacterial Spot, Septoria | 35% – 70% |
| **Fruits** | Apple, Grape, Citrus | Apple Scab, Black Rot, Citrus Canker, Cedar Apple Rust, Powdery Mildew | 25% – 50% |

---

## 4. Key Value Propositions & Solution Pillars

```
                     +---------------------------------------+
                     |    Python FastAPI Cloud AI Engine     |
                     +---------------------------------------+
                                         |
     +-------------------+---------------+-------------------+--------------------+
     |                   |                                   |                    |
     v                   v                                   v                    v
+---------------+ +-------------------+             +------------------+ +-----------------+
|  PyTorch Deep | |  Hyper-Localized  |             | Audio & Regional | | Dosage & Impact |
|  Vision Model | |    Cure Engine    |             |    Voice First   | |   Calculator    |
|  (MobileNetV2)| | (Organic/Chemical)|             | (Urdu/Pashto/etc)| | (Per Acre/Kanal)|
+---------------+ +-------------------+             +------------------+ +-----------------+
```

1. **Python FastAPI Deep Learning Pipeline:** Native PyTorch model execution processing image tensors and returning top-1 and top-3 class probabilities with confidence scores within 1-2 seconds.
2. **Dual-Treatment Recommendation:** Provides both cost-effective Organic Remedies ("Desi Totkay" / Bio-pesticides) and Verified Chemical Remedies with local brand names (*Nativo, Ridomil Gold, Score, Aliette, Movento*).
3. **Multilingual & Audio First:** Integrated Web Speech API and server audio generator in **Urdu (اردو), Pashto (پښتو), Sindhi (سنڌي), and English**.
4. **Precision Spray & Dosage Calculator:** Converts field measurements (Acre, Kanal, Marla) into exact chemical amounts (grams/ml) and water volume (20L knapsack tanks).
5. **Centralized Field Diary & History:** User scan history saved securely in the cloud database, enabling historical trend tracking across seasons.

---

## 5. Scope Matrix (MoSCoW Framework)

### 5.1 Must-Have (MVP Scope for Vibecoding Sprint)
- [x] **Web Camera & Image Uploader:** HTML5 camera capture and file picker with live framing overlay.
- [x] **Python FastAPI Diagnostic Endpoint:** `POST /api/v1/diagnose` performing PyTorch image classification across 38+ plant disease classes.
- [x] **Rich Diagnosis Presentation Screen:** Disease name (English & Urdu), severity status (Low, Moderate, Severe), confidence meter, and pathogen category.
- [x] **Dual Treatment Guidance:**
  - Organic/Biological solutions with step-by-step preparation steps.
  - Chemical solutions with active ingredients, localized brand names, safety pre-harvest intervals (PHI).
- [x] **Interactive Spray Dosage Calculator:** Input land area (Acre, Kanal, Marla) -> Automatic calculation of water tanks, chemical quantity, and tank mixing ratios.
- [x] **Voice Readout (TTS):** 1-tap audio narration of diagnosis and remedy in Urdu and English.
- [x] **Multilingual UI:** Instant toggle between English, Urdu, Pashto, and Sindhi with RTL script support.
- [x] **Cloud Scan History (Field Diary):** Centralized database storage of scans with thumbnail previews, timestamps, and search/filter tools.
- [x] **Disease Encyclopedia / Knowledge Base:** Comprehensive catalog of 38+ plant diseases with symptom descriptions, sample photos, causes, and prevention strategies.

### 5.2 Should-Have (Phase 2)
- [ ] **Agronomist WhatsApp Direct Bridge:** 1-click formatted diagnostic summary sent to certified agronomists via WhatsApp.
- [ ] **Weather & Disease Risk Advisory:** Live weather API integration calculating fungal/viral vulnerability index based on temperature and humidity.
- [ ] **Regional Outbreak Heatmap:** Interactive map displaying aggregated crop disease outbreaks across districts.

---

## 6. Non-Functional Requirements (NFR)

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Response Latency** | End-to-end cloud scan response | $< 1.2$ seconds on 4G / 3G |
| **Model Precision** | Server-side Top-1 / Top-3 Accuracy | $> 94.5\%$ Top-1, $> 98.2\%$ Top-3 |
| **Backend Throughput** | FastAPI Async concurrency | $> 200$ req/sec per worker instance |
| **Uptime & Scalability** | Backend availability | $99.9\%$ SLA with stateless Docker/Uvicorn scaling |
| **Accessibility** | Color contrast & UI usability | WCAG 2.1 Level AA compliant |
| **Browser Compatibility** | Modern mobile & desktop browsers | Chrome, Safari, Edge, Firefox, Samsung Internet |

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

- **End-to-End Latency:** Total time from camera shutter click to diagnosis result rendered $< 1.5$ seconds.
- **Diagnostic Success Rate:** $> 95\%$ of valid leaf uploads correctly classified.
- **Farmer Usability Score:** $> 85\%$ task completion rate on first-time usage among regional language speakers.
- **Pesticide Optimization Impact:** Estimated $30\%+$ reduction in unnecessary chemical usage through accurate dosage calculation.
