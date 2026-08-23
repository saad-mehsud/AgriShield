# 🎨 UI/UX Design Specification & Design System
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 3.0.0 (FastAPI-Powered Web Application)  
**Design Philosophy:** "One-Tap Agri-Simplicity" — High sunlight contrast, visual pictograms, audio-first voice assist, smooth cloud processing indicators, and 56px touch targets for rugged outdoor field usage.

---

## 1. Design Principles

1. **Sunlight-Readable High Contrast:** Bright outdoor glare washes out delicate pastels. The interface uses crisp off-whites (`#F8FAFC`), deep slate typography (`#0F172A`), and vibrant emerald greens (`#15803D`).
2. **Instant Visual Feedback & Cloud Loading:** When an image is uploaded for FastAPI analysis, an animated laser-scan wave with informative status chips (*"Uploading Image...", "FastAPI AI Analyzing Pathogens...", "Formulating Local Remedies..."*) keeps the user engaged during the 1-second roundtrip.
3. **Audio as a First-Class Citizen:** Every diagnostic result, dosage calculation, and advisory tip features a prominent "Listen in Urdu" (سنیں) speaker button.
4. **Zero-Friction Camera & Upload:** Seamless HTML5 camera viewfinder with automatic fallback to native mobile photo picker.

---

## 2. Design System & Color Palette

### 2.1 Color Token Matrix

| Token Name | Hex Code | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Primary Forest Green** | `#15803D` | `bg-emerald-700` | Primary CTA buttons, active tabs, brand headers |
| **Accent Leaf Green** | `#22C55E` | `bg-green-500` | Healthy crop indicators, success badges, camera guides |
| **Earth / Soil Dark** | `#78350F` | `bg-amber-900` | Organic remedy badges, field diary headers |
| **Sunlight Warning Amber** | `#F59E0B` | `bg-amber-500` | Moderate disease warning, weather risk badge |
| **Disease Danger Red** | `#DC2626` | `bg-red-600` | Critical pathogen alerts, high severity tags |
| **Outdoor Background** | `#F8FAFC` | `bg-slate-50` | Primary app background (glare resistant) |
| **Card Surface** | `#FFFFFF` | `bg-white` | Elevated diagnosis cards, modal sheets |
| **Text Primary** | `#0F172A` | `text-slate-900` | High-contrast body text and headers |
| **Text Muted** | `#475569` | `text-slate-600` | Secondary descriptions, timestamps |
| **Border / Divider** | `#E2E8F0` | `border-slate-200`| Structural borders, card dividers |

---

## 3. Typography & Regional Font Stack

### 3.1 Font Families
- **English / Latin:** `Inter`, `Outfit`, `-apple-system`, `sans-serif`
- **Urdu / Arabic Script:** `Noto Nastaliq Urdu`, `Noto Sans Arabic`, `Gulzar`, `sans-serif`
- **Pashto / Sindhi:** `Noto Sans Arabic`, `system-ui`

### 3.2 Type Scale
- **Display Hero:** `32px` / Bold (700) — Main diagnosis title
- **Heading 1:** `24px` / SemiBold (600) — Section headers
- **Heading 2:** `18px` / SemiBold (600) — Card & tab headers
- **Body Large:** `16px` / Regular (400) — Treatment instructions
- **Body Small:** `14px` / Medium (500) — Dosage ratios, timestamps

---

## 4. Screen-by-Screen Layout Specifications

### Screen 1: Language & Regional Onboarding
- **Header:** AgriShield (کسان دوست) Logo with wheat/leaf emblem.
- **Language Card Grid:** 4 large, high-contrast touch cards:
  - 🇵🇰 **اُردو (Urdu)** — Default selected
  - 🏴 **پښتو (Pashto)**
  - 🌊 **سنڌي (Sindhi)**
  - 🌐 **English**
- **Action:** Single prominent green button: *"Continue / آگے بڑھیں"*

---

### Screen 2: Main Dashboard (Home)
- **Top Bar:** Location tag ("📍 Multan, Punjab"), Language switch icon, FastAPI Backend status indicator (`🟢 Backend Connected`).
- **Weather & Disease Risk Alert Banner:** 
  - *"High Humidity Alert (85%): Fungal Blight Risk elevated for Tomatoes & Potatoes."*
- **Hero Scanner Card (Focal Point):**
  - Giant camera button: **"📸 Take Photo or Upload Leaf / پتے کا معائنہ کریں"**
  - Quick action: "Upload from Gallery / گیلری سے اپ لوڈ کریں".
- **Quick Metric Row:**
  - `Total Scans (12)` | `Diseases Detected (3)` | `Healthy Crops (9)`
- **Recent Scans Carousel:** Past scans retrieved from FastAPI database with thumbnails, crop titles, and status tags.
- **Quick Navigation Grid:**
  - 📚 Disease Encyclopedia (بیماریوں کی لغت)
  - 🧪 Spray Dosage Calculator (دوائی کا حساب)
  - 👨‍🌾 Ask Agronomist on WhatsApp (ماہر زراعت سے رابطہ)

---

### Screen 3: Camera Viewfinder & Upload Modal
- **Live Video Feed:** Fullscreen or 4:3 camera view.
- **Leaf Framing Overlay:** Bounding box with leaf silhouette guideline.
- **Real-Time Helper Tooltip:** *"Place diseased leaf inside frame & tap Shutter / پتے کو فریم کے اندر لائیں"*
- **Controls Bar:**
  - ⚡ Flash/Torch Toggle
  - 🔄 Camera Flip (Back/Front)
  - 🖼️ Gallery Upload Button
  - ⚪ **Big Shutter Button (72x72px)** with green pulse ring.

---

### Screen 4: Cloud Analyzing State (Laser Scanner)
When the user captures or uploads an image:
- Display the captured leaf photo with an animated laser scanning line sweeping up and down.
- Progress Stepper:
  - `[✓] Uploading Leaf Image to FastAPI Server...`
  - `[🔄] PyTorch Deep Model Analyzing Pathogens...`
  - `[  ] Formulating Localized Cures & Dosage...`
- Smooth transition directly into the Diagnosis Screen upon FastAPI response.

```
+------------------------------------------+
|                                          |
|         +----------------------+         |
|         |  [ Leaf Preview ]    |         |
|         |  ==================  | <- Scan |
|         |                      |    Line |
|         +----------------------+         |
|                                          |
|      ⚡ Analyzing on FastAPI Cloud...     |
|   (کلاؤڈ اے آئی پر معائنہ ہو رہا ہے)     |
|                                          |
|  [||||||||||||||||........] 75%          |
+------------------------------------------+
```

---

### Screen 5: Diagnostic Result & Action Center (Core Screen)
- **Status Header:**
  - Critical Banner: `🔴 Early Blight Detected (اگیتا جھلسائو)`
  - Crop: `🍅 Tomato (ٹماٹر)`
  - Confidence Score: Circular meter (`96% Accuracy`)
- **Audio Readout Bar:**
  - Large button: `🔊 سنیں (Listen in Urdu) / Stop` with animated sound waves.
- **Severity Indicator:** `[ Low | Moderate | ⚠️ SEVERE ]`
- **Tabbed Remedy System:**
  1. **🌿 Organic Remedy (قدرتی علاج):**
     - Step 1: Remove and burn all infected bottom leaves.
     - Step 2: Spray Neem Seed Kernel Extract (50ml per 10L water) every 7 days.
  2. **🧪 Chemical Treatment (کیمیائی ادویات):**
     - Active Ingredient: *Mancozeb 75% WP + Metalaxyl 8%*
     - Recommended Local Brands: *Ridomil Gold, Score 250 EC, Nativo*
     - Safety: Wear gloves, 7-day pre-harvest waiting interval (PHI).
  3. **⚖️ Spray Dosage Calculator Tab:**
     - Input field area: `[ 2 ] [ Acres ▾ ]`
     - Auto Calculation:
       - Required Water: `200 Liters (10 Knapsack Tanks)`
       - Required Chemical: `500 Grams (50g per Tank)`
- **Action Footer:**
  - `📲 Send Report to Agronomist on WhatsApp` | `📸 Scan Another Leaf (نیا اسکین)`

---

### Screen 6: Field Diary (Scan History)
- **Filter Chips:** `All Scans` | `Cotton` | `Wheat` | `Tomato` | `Diseased Only`
- **Diary Cards:** Each card displays image thumbnail, crop/disease title (UR/EN), date, time, and severity badge.
- 1-tap view full report or share to WhatsApp.

---

### Screen 7: Disease Encyclopedia
- **Search Bar:** Real-time search in English or Urdu.
- **Crop Category Filters:** Grid of crop icons (Wheat, Rice, Cotton, Tomato, Potato, Apple, Citrus).
- **Disease Cards:** 38+ plant diseases with symptom descriptions, clear photo examples, causal agents, and preventive crop rotation advice.
