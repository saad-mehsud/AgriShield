# 🌾 Product Requirements Document (PRD)
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Vibecoding)  
**Target Platform:** Progressive Web App (PWA) / Mobile-first Web Application  
**Primary Region:** Pakistan & South Asian Agro-zones (Universal applicability for global crops)  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
To democratize plant pathology for millions of smallholder and commercial farmers by putting an instant, offline-capable, AI-powered agronomist in their pockets. The application delivers sub-second disease identification from a single leaf photo, provides hyper-localized treatment remedies (both organic and chemical), calculates exact chemical dosages to stop chemical overuse, and translates actionable insights into local regional languages with voice readout capabilities.

### 1.2 The Core Problem
Agriculture is the foundation of Pakistan's economy, accounting for roughly 23% of GDP and employing ~37% of the labor force. However, farmers suffer catastrophic post-harvest and crop disease losses ranging between **PKR 345 Billion and PKR 523 Billion annually**. 

```
+-----------------------------------------------------------------------------------+
|                              THE AGRICULTURAL CRISIS                              |
+-----------------------------------------------------------------------------------+
|  1. Delayed Expert Access  -->  Diseases spread unchecked before diagnosis.       |
|  2. Overuse of Chemicals   -->  Blind application of expensive broad-spectrum     |
|                                 pesticides destroys soil, water, and farmer debt. |
|  3. Literacy & Connectivity-->  Rural areas lack stable 4G/5G and complex English |
|     Barriers                    apps fail to serve grassroots farmers.            |
+-----------------------------------------------------------------------------------+
```

---

## 2. Target User Personas

### Persona 1: Bashir Ahmed (Smallholder Farmer - Primary User)
- **Age:** 46
- **Location:** Rahim Yar Khan, Punjab (Cotton & Wheat Belt)
- **Landholding:** 4.5 Acres
- **Tech Literacy:** Low-to-moderate (Uses WhatsApp voice notes, YouTube, TikTok; struggles with complex English text).
- **Device:** Budget Android smartphone (Android 10/11, 2GB RAM, intermittent 2G/3G connectivity).
- **Core Pain Point:** Sees yellow spots and curling on cotton leaves. Cannot afford an agronomist visit. Spends PKR 18,000 on generic spray that fails to work because the issue is viral (CLCuV) rather than fungal.
- **Needs:** 1-tap photo scan, Urdu audio voice readout, exact spray mixture per acre/kanal, offline functionality.

### Persona 2: Dr. Tariq Mahmood (Field Extension Worker / Agronomist)
- **Age:** 34
- **Location:** Tandojam, Sindh
- **Role:** Government Agricultural Extension Officer overseeing 40+ villages.
- **Tech Literacy:** High.
- **Core Pain Point:** Overwhelmed by farmer calls; impossible to visit every farm in person before blight spreads.
- **Needs:** Fast validation tool, exportable scan history, disease outbreak heatmaps, reference catalog of active ingredients and fungicides.

### Persona 3: Farhan Malik (Progressive Commercial Farmer)
- **Age:** 29
- **Location:** Multan / Faisalabad
- **Landholding:** 80 Acres (Citrus, Mango, Tomato, Rice)
- **Tech Literacy:** High (Uses smart irrigation, weather apps).
- **Needs:** Batch diagnosis records, chemical vs. organic cost-benefit comparisons, preventive spray schedules, high-resolution diagnostic confidence score.

---

## 3. Vulnerable Crops & Target Pathogen Scope

| Crop Category | Target Crops | Primary Diseases / Pathogens | Typical Yield Loss |
| :--- | :--- | :--- | :--- |
| **Cash Crops** | Cotton, Sugarcane | Cotton Leaf Curl Virus (CLCuV), Root Rot, Red Rot, Bacterial Blight | 30% – 60% |
| **Cereal & Grains** | Wheat, Rice, Corn (Maize) | Yellow/Brown Rust, Rice Blast, Brown Spot, Northern Leaf Blight | 20% – 45% |
| **Vegetables** | Tomato, Potato, Pepper | Early Blight, Late Blight, Tomato Yellow Leaf Curl, Bacterial Spot, Septoria | 35% – 70% |
| **Fruits** | Apple, Grape, Citrus | Apple Scab, Black Rot, Citrus Canker, Cedar Apple Rust, Powdery Mildew | 25% – 50% |

---

## 4. Key Value Propositions & Solution Pillars

```
                             +------------------------+
                             |   AgriShield Engine    |
                             +------------------------+
                                         |
     +-------------------+---------------+-------------------+--------------------+
     |                   |                                   |                    |
     v                   v                                   v                    v
+---------------+ +-------------------+             +------------------+ +-----------------+
|  Instant Edge | |  Hyper-Localized  |             | Audio & Regional | | Dosage & Impact |
|  Diagnostics  | |    Cure Engine    |             |    Voice First   | |   Calculator    |
| (Offline CNN) | | (Organic/Chemical)|             | (Urdu/Pashto/etc)| | (Per Acre/Kanal)|
+---------------+ +-------------------+             +------------------+ +-----------------+
```

1. **Sub-second Edge AI Diagnostics:** Runs directly inside the browser using WebAssembly / TensorFlow.js, requiring zero active internet connection once loaded.
2. **Dual-Treatment Protocol:** Provides both cost-effective Organic Remedies ("Desi Totkay" / Bio-pesticides like Neem Oil, Wood Ash) and Verified Chemical Remedies with local brand names (e.g., Nativo, Ridomil Gold, Score, Aliette).
3. **Voice & Multilingual Native:** Real-time Text-to-Speech (TTS) readout in **Urdu (اردو), Pashto (پښتو), Sindhi (سنڌي), Punjabi (پنجابی), and English**, making it 100% accessible to non-literate farmers.
4. **Precision Spray & Dosage Calculator:** Converts field size (Acre, Kanal, Bigha, Marla) into precise chemical amounts (ml/grams) and water volume (liters/tanks) to prevent chemical overuse and toxicity.
5. **Field Diary & Disease History:** Local-first scan repository with geo-tagging, symptom progression tracking, and offline sync.

---

## 5. Scope Matrix (MoSCoW Framework)

### 5.1 Must-Have (MVP Scope for Vibecoding Sprint)
- [x] **Universal Camera & Image Upload:** Real-time viewfinder with capture assistance (focus indicator, lighting guide) and gallery selector.
- [x] **Offline Edge ML Inference:** In-browser inference model (MobileNetV2 / EfficientNet-Lite) supporting 38+ crop-disease classes with confidence scoring.
- [x] **Instant Diagnosis Screen:** Clear health status indicator (Healthy vs. Diseased), disease name in English and Urdu, severity level (Low, Moderate, High).
- [x] **Dual Treatment Guidance:**
  - Organic/Biological solutions with step-by-step preparation steps.
  - Chemical solutions with active ingredient, local trade names, and safety guidelines.
- [x] **Smart Dosage Calculator:** Input land area (Acre, Kanal, Marla, Square Meters) to get exact tank count and chemical concentration.
- [x] **Voice Readout (TTS):** 1-tap audio narration of diagnosis and remedy in Urdu and English.
- [x] **Multilingual Support:** Instant UI toggle between English, Urdu, Pashto, and Sindhi.
- [x] **Local Scan History (Field Diary):** IndexedDB-backed offline diary storing past scans, images, and notes.
- [x] **Disease Encyclopedia / Offline Catalog:** Searchable offline database with disease symptoms, causes, sample photos, and prevention tips.
- [x] **PWA Installability:** Installable as a standalone app on Android, iOS, and Desktop with offline caching.

### 5.2 Should-Have (Phase 2)
- [ ] **Agronomist WhatsApp Direct Bridge:** 1-click generation of formatted diagnostic reports sent directly to expert WhatsApp agronomists or community helplines.
- [ ] **Weather & Disease Risk Index:** Hyper-local weather fetching with humidity/temperature-based fungal and viral risk warnings.
- [ ] **Regional Outbreak Heatmap:** Anonymous aggregated community scan data visualizing nearby disease outbreaks on an interactive map.

### 5.3 Could-Have (Phase 3)
- [ ] Multi-leaf batch scanning in a single shot.
- [ ] AI Chatbot Assistant ("Kisan AI") for natural voice Q&A about crop health.
- [ ] Drone / Satellite imagery integration for large farm coverage.

### 5.4 Won't-Have (Out of Scope for Initial Release)
- Hardware sensor integrations (soil probe hardware).
- Direct e-commerce marketplace for selling pesticides (we remain an objective diagnostic tool).

---

## 6. Detailed Functional Specifications

### 6.1 Diagnostic Workflow & Edge Inference
- **Input:** JPEG/PNG/WebP image (live camera capture or file upload).
- **Processing:** Image normalized to 224x224 RGB tensor.
- **Inference Time:** $\le 600$ ms on standard mobile CPU/GPU.
- **Confidence Threshold:**
  - $\ge 75\%$: High Confidence -> Direct diagnosis display.
  - $50\% - 74\%$: Moderate Confidence -> Displays top 2 probable conditions with warning.
  - $< 50\%$: Low Confidence -> Asks user to retake photo with clearer lighting / closer leaf focus.

### 6.2 Treatment Recommendation Structure
Every disease result must contain:
1. **Disease Overview:** Common name, local name, causal organism (Fungus/Bacteria/Virus/Pest).
2. **Visual Symptoms:** What to look for (lesions, concentric rings, chlorosis).
3. **Immediate Action:** Containment steps (prune infected leaves, isolate field zone).
4. **Organic Remedy:** Low-cost, natural bio-pesticides (e.g., Garlic extract, Neem oil, Trichoderma).
5. **Chemical Remedy:** Standard agrochemical formulas (e.g., Mancozeb 75% WP, Copper Oxychloride, Imidacloprid) with safety pre-harvest intervals (PHI).
6. **Dosage Table:** Configurable matrix for standard knapsack sprayers (16L / 20L).

### 6.3 Voice & Accessibility Protocol
- Audio play button prominently placed at the top of the diagnosis card.
- Clear visual status colors:
  - 🟢 **Healthy / Safe:** `#16A34A`
  - 🟡 **Moderate / Warning:** `#EAB308`
  - 🔴 **Severe / Critical:** `#DC2626`
- Minimum touch target size: $48 \times 48$ px (suitable for one-handed operation in the field).

---

## 7. Non-Functional Requirements (NFR)

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Performance** | Time to Interactive (TTI) | $< 1.8$s on 3G network |
| **Offline Capability** | Full offline functionality | 100% core features (Scan, Diagnose, History, Library) work without internet |
| **Bundle Size** | PWA Core bundle + ML model | Model $< 5.5$ MB, Initial JS bundle $< 250$ KB gzipped |
| **Accuracy** | Top-1 Accuracy on standard test set | $> 92.5\%$ Top-1, $> 97.8\%$ Top-3 |
| **Accessibility** | Color contrast & navigation | WCAG 2.1 Level AA compliant |
| **Cross-Platform** | Supported environments | Chrome Android, Safari iOS, Edge, Firefox, Desktop PWA |

---

## 8. Success Metrics & Key Performance Indicators (KPIs)

- **Diagnostic Speed:** Average scan-to-result time $< 1.0$ second.
- **Diagnostic Completion Rate:** $> 90\%$ of started scans result in a successful diagnosis without drop-off.
- **Offline Resilience:** $0$ crashes or network errors when running in airplane mode.
- **Farmer Usability Score:** $> 85\%$ task success rate on first-time usage among non-English native speakers.
- **Chemical Reduction Impact:** Estimated $30\%+$ reduction in unnecessary pesticide spray volume through accurate dosage and organic first-line suggestions.
