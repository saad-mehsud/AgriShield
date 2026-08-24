# 🌾 Product Requirements Document (PRD)
## Project: AgriShield (کسان دوست) — AI-Powered Crop Disease Diagnostics & Explainable Decision Support System

**Document Version:** 4.0.0 (Custom PyTorch ML + Explainable AI Edition)  
**Status:** Approved for Implementation  
**Architecture:** Python FastAPI + Custom PyTorch Computer Vision (MobileNetV3/EfficientNet) + Grad-CAM Explainable AI + Next.js Web Frontend  
**Target Market:** Pakistan & South Asian Agro-zones (Zero Foreign API Costs, 100% Self-Hosted)  

---

## 1. Executive Summary & Product Vision

### 1.1 Product Vision
AgriShield (کسان دوست) is an authentic, self-hosted Machine Learning and Computer Vision decision support platform designed to democratize plant pathology for farmers in Pakistan. The system runs a **custom fine-tuned PyTorch Deep Learning model** (MobileNetV3-Large / EfficientNet-B0) on a **Python FastAPI** backend, executing in sub-30ms without requiring paid third-party APIs. 

To ensure complete transparency and build trust with agronomists, the system features **Explainable AI (Grad-CAM Heatmaps)** that visually highlight the exact pathological lesions on the leaf that influenced the neural network's diagnosis. The diagnosis is paired with certified Pakistani agrochemical prescriptions (Syngenta, Bayer, FMC Pakistan), organic bio-remedies ("Desi Totkay"), localized land dosage math (Acres/Kanals/Marlas $\to$ 20L spray tanks), and native **Urdu, Pashto, and Sindhi voice readout**.

### 1.2 The Problem Statement
- **Economic Hemorrhage:** Annual post-harvest and crop disease losses in Pakistan cost between **PKR 345 Billion and PKR 523 Billion**.
- **Blind Chemical Overuse:** Farmers preemptively spray broad-spectrum, expensive pesticides without accurate pathogen identification, degrading soil biology and incurring high debt.
- **Black-Box AI Skepticism:** Traditional AI diagnostic tools give raw text predictions without visual proof, causing farmers and agronomists to distrust automated advice.
- **Foreign Currency Dependency:** Cloud API-based solutions (charging USD per scan) are financially unsustainable for Pakistani grassroots farmers and local agri-institutions.

```
+-----------------------------------------------------------------------------------+
|                        THE AGRISHIELD ML VALUE PROPOSITION                        |
+-----------------------------------------------------------------------------------+
|  1. 100% Self-Hosted ML      -->  Zero API fees, runs locally on standard CPU/VPS |
|  2. Explainable AI (Grad-CAM)-->  Visual heatmaps prove neural network attention  |
|  3. Hyper-Local Cures        -->  Pakistani market brands (Nativo, Ridomil Gold)  |
|  4. Local Land Units         -->  Dosage computed for Acres, Kanals, and Marlas   |
|  5. Illiterate-Friendly      -->  Urdu voice narration (سنیں) with sunlight UI    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Target User Personas

### Persona 1: Bashir Ahmed (Smallholder Cotton & Wheat Farmer)
- **Location:** Rahim Yar Khan, Punjab (Cotton Belt)
- **Landholding:** 3.5 Acres
- **Tech Profile:** Low-to-moderate literacy; uses WhatsApp voice notes; operates an entry-level Android phone under bright sunlight.
- **Key Pain Point:** Notices leaf curling and vein thickening on cotton. Spends PKR 16,000 on generic fungal spray that fails because the issue is viral (Cotton Leaf Curl Virus transmitted by whiteflies).
- **Needs:** 1-tap photo scan, visual proof of disease location, Urdu audio readout, exact dosage for his 20L battery knapsack sprayer.

### Persona 2: Dr. Tariq Mahmood (Field Extension Agronomist)
- **Location:** Tandojam, Sindh
- **Role:** Agricultural Officer overseeing 30+ villages.
- **Tech Profile:** High; holds an MSc in Plant Pathology.
- **Key Pain Point:** Needs a fast, verified diagnostic validation tool with visual transparency.
- **Needs:** **Grad-CAM heatmaps** to verify fungal vs. bacterial lesion margins, active ingredient directory, exportable scan history.

---

## 3. Vulnerable Crops & Pathogen Coverage

| Crop Category | Target Crops | Primary Diseases / Pathogens | Typical Yield Loss |
| :--- | :--- | :--- | :--- |
| **Cash Crops** | Cotton, Sugarcane | Cotton Leaf Curl Virus (CLCuV), Bacterial Blight, Red Rot, Root Rot | 30% – 60% |
| **Cereal & Grains** | Wheat, Rice, Corn (Maize) | Yellow/Brown Rust, Rice Blast, Brown Spot, Northern Leaf Blight | 20% – 45% |
| **Vegetables** | Tomato, Potato, Chili | Early Blight, Late Blight, Tomato Yellow Leaf Curl, Bacterial Spot, Chili Mosaic | 35% – 70% |
| **Fruits** | Citrus, Mango, Apple | Citrus Canker, Mango Anthracnose, Powdery Mildew, Apple Scab | 25% – 50% |

---

## 4. Key Value Propositions & Solution Pillars

```
                     +---------------------------------------+
                     |       AgriShield ML Vision Core       |
                     +---------------------------------------+
                                         │
     +-------------------+---------------+-------------------+--------------------+
     │                   │                                   │                    │
     ▼                   ▼                                   ▼                    ▼
+---------------+ +-------------------+             +------------------+ +-----------------+
| PyTorch Custom| | Explainable AI    |             | Localized Market | | Dosage & Audio  |
|  Vision Model | | (Grad-CAM Heatmap)|             | Knowledge Engine | | Support Engine  |
| (MobileNetV3) | | (Visual Evidence) |             | (Syngenta/Bayer) | | (Urdu Voice/TTS)|
+---------------+ +-------------------+             +------------------+ +-----------------+
```

1. **Custom PyTorch Deep Vision Engine:** Sub-30ms inference executing on standard CPU with pre-trained and fine-tuned MobileNetV3-Large weights.
2. **Explainable AI (Grad-CAM):** Extracts activation gradients from the final convolutional layer to generate a superimposed heatmap on the leaf image.
3. **Pakistani Agrochemical & Organic Engine:** Curated database of registered Pakistani brand names (*Nativo, Score, Ridomil Gold, Movento, Aliette, Match, Belt*) paired with low-cost "Desi Totkay" (Neem oil, tobacco extract, wood ash).
4. **Localized Spray Dosage Math:** Converts land measurements (**Acre / ایکڑ, Kanal / کنال, Marla / مرلہ**) into exact 16L/20L knapsack tank counts and chemical grams.
5. **Urdu / Regional Voice First:** Native browser Web Speech API readout in Urdu (اردو), Pashto (پښتو), and Sindhi (سنڌي).
6. **Centralized Field Diary:** Tracks scans over time with timestamps and severity markers.

---

## 5. Scope Matrix (MoSCoW Framework)

### 5.1 Must-Have (Hackathon Scope)
- [x] **HTML5 Camera Viewfinder & File Picker:** Live camera capture with leaf framing guideline, flash toggle, and gallery selector.
- [x] **FastAPI Custom ML Endpoint:** `POST /api/v1/diagnose` running PyTorch inference and generating Grad-CAM heatmaps.
- [x] **Explainable AI Heatmap Viewer:** Interactive UI toggle allowing users to switch between the original leaf photo and the Grad-CAM lesion heatmap.
- [x] **Dual Treatment Recommendations:**
  - Organic/Biological remedies ("Desi Totkay") with step-by-step preparation.
  - Certified Pakistani chemical brands with active ingredients and safety Pre-Harvest Intervals (PHI).
- [x] **Pakistani Land Unit Dosage Calculator:** Input field size in Acres, Kanals, or Marlas $\to$ Auto-computes 20L tank count and chemical concentration.
- [x] **Urdu Audio Narration (TTS):** 1-tap speech synthesis speaking the diagnosis and spray instructions aloud.
- [x] **Multilingual UI:** Instant toggle between English, Urdu, Pashto, and Sindhi with full RTL layout support.
- [x] **Field Diary (Scan History):** Local/cloud scan persistence storing leaf thumbnails, heatmaps, and diagnostic records.
- [x] **Disease Encyclopedia:** Searchable catalog of crop diseases with symptoms, photos, and localized management strategies.

### 5.2 Should-Have (Post-Hackathon)
- [ ] **1-Tap WhatsApp Agronomist Bridge:** Formatted diagnostic summary sharing directly to certified extension officers on WhatsApp.
- [ ] **Weather-Driven Outbreak Index:** Live humidity/temperature alert engine warning of elevated fungal sporulation conditions.

---

## 6. Non-Functional Requirements (NFR)

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Inference Latency** | Model execution time on standard CPU | $\le 30$ ms (Total API round-trip $\le 300$ ms) |
| **Grad-CAM Latency** | Heatmap computation and overlay | $\le 45$ ms |
| **Classification Accuracy** | Top-1 validation accuracy on test set | $> 98.0\%$ |
| **Memory Footprint** | Serialized model weight size | $< 20$ MB (MobileNetV3) |
| **Financial Cost** | Third-party recurring API expense | **$0.00 / month** (100% Free & Self-Hosted) |
| **Accessibility** | Sunlight readability & contrast | WCAG 2.1 Level AA compliant |
