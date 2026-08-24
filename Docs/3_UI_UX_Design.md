# 🎨 UI/UX Design Specification & Design System
## Project: AgriShield (کسان دوست) — AI Crop Disease Diagnostics & Explainable Decision Support System

**Document Version:** 4.0.0 (Custom PyTorch ML + Explainable AI Edition)  
**Design Philosophy:** "One-Tap Agri-Simplicity & Visual Transparency" — High sunlight contrast, interactive Grad-CAM heatmap inspection, audio-first voice assist, and 56px touch targets for rugged outdoor field usage.

---

## 1. Design Principles

1. **Sunlight-Readable High Contrast:** Bright outdoor glare washes out delicate pastels. The interface uses crisp off-whites (`#F8FAFC`), deep slate typography (`#0F172A`), and vibrant emerald greens (`#15803D`).
2. **Explainable AI Visual Transparency:** The diagnostic screen includes an interactive **Grad-CAM Heatmap Toggle** (`📷 Original Leaf` ⟷ `🔥 AI Lesion Heatmap`) so agronomists and farmers can see the exact leaf spots the AI evaluated.
3. **Audio as a First-Class Citizen:** Every diagnostic result, dosage calculation, and advisory tip features a prominent "Listen in Urdu" (سنیں) speaker button.
4. **Pakistani Land Unit Simplicity:** Dosage inputs default to local farming units (**Acres / ایکڑ, Kanals / کنال, Marlas / مرلہ**) instead of confusing Western hectares.

---

## 2. Design System & Color Palette

### 2.1 Color Token Matrix

| Token Name | Hex Code | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Primary Forest Green** | `#15803D` | `bg-emerald-700` | Primary CTA buttons, active tabs, brand headers |
| **Accent Leaf Green** | `#22C55E` | `bg-green-500` | Healthy crop indicators, success badges, camera guides |
| **Grad-CAM Attention Red** | `#DC2626` | `bg-red-600` | Severe pathogen lesions, high attention heatmap focus |
| **Grad-CAM Moderate Yellow**| `#F59E0B` | `bg-amber-500` | Moderate disease warning, secondary heatmap zones |
| **Earth / Soil Dark** | `#78350F` | `bg-amber-900` | Organic remedy badges, field diary headers |
| **Outdoor Background** | `#F8FAFC` | `bg-slate-50` | Primary app canvas (glare resistant) |
| **Card Surface** | `#FFFFFF` | `bg-white` | Elevated diagnosis cards, modal sheets |
| **Text Primary** | `#0F172A` | `text-slate-900` | High-contrast body text and headers |
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

### Screen 1: Language Selection & Onboarding
- **Header:** AgriShield (کسان دوست) Logo with wheat/leaf emblem.
- **Language Card Grid:** 4 large touch cards:
  - 🇵🇰 **اُردو (Urdu)** — Default selected
  - 🏴 **پښتو (Pashto)**
  - 🌊 **سنڌي (Sindhi)**
  - 🌐 **English**
- **Action:** Single prominent green button: *"Continue / آگے بڑھیں"*

---

### Screen 2: Main Dashboard (Home)
- **Top Bar:** Location tag ("📍 Rahim Yar Khan, Punjab"), Language switch icon, ML status indicator (`🟢 PyTorch ML Engine Active`).
- **Hero Scanner Card (Focal Point):**
  - Giant camera button: **"📸 Take Photo or Upload Leaf / پتے کا معائنہ کریں"**
  - Quick action: "Upload from Gallery / گیلری سے اپ لوڈ کریں".
- **Quick Metric Row:**
  - `Total Scans (14)` | `Diseases Detected (4)` | `Healthy Crops (10)`
- **Recent Scans Carousel:** Past scans retrieved from local database with thumbnails, crop titles, and status tags.
- **Quick Navigation Grid:**
  - 📚 Disease Encyclopedia (بیماریوں کی لغت)
  - 🧪 Spray Dosage Calculator (دوائی کا حساب)
  - 👨‍🌾 Ask Agronomist on WhatsApp (ماہر زراعت سے رابطہ)

---

### Screen 3: Camera Viewfinder & Framing Overlay
- **Live Video Feed:** Fullscreen or 4:3 camera view.
- **Leaf Framing Overlay:** Bounding box with leaf silhouette guideline.
- **Real-Time Helper Tooltip:** *"Place diseased leaf inside frame & tap Shutter / پتے کو فریم کے اندر لائیں"*
- **Controls Bar:**
  - ⚡ Flash/Torch Toggle
  - 🔄 Camera Flip (Back/Front)
  - 🖼️ Gallery Upload Button
  - ⚪ **Big Shutter Button (72x72px)** with green pulse ring.

---

### Screen 4: Diagnostic Result & Explainable AI (Core Screen)
- **Status Header:**
  - Critical Banner: `🔴 Early Blight Detected (اگیتا جھلسائو)`
  - Crop: `🍅 Tomato (ٹماٹر)`
  - Confidence Score: Circular meter (`96.8% Accuracy`)
  - Inference Latency: Badge (`⚡ 24ms CPU`)
- **Explainable AI (Grad-CAM) Visual Toggle:**
  - Interactive pill switcher: `[ 📷 Original Photo ]` | `[ 🔥 AI Lesion Heatmap ]`
  - Explanatory note: *"Red areas highlight the diseased tissue analyzed by the neural network."*
- **Audio Readout Bar:**
  - Large button: `🔊 سنیں (Listen in Urdu) / Stop` with animated sound waves.
- **Severity Indicator:** `[ Low | Moderate | ⚠️ SEVERE ]`
- **Tabbed Remedy System:**
  1. **🌿 Organic Remedy (قدرتی علاج / دیسی ٹوٹکے):**
     - Step 1: Remove and burn all infected bottom leaves.
     - Step 2: Spray Neem Seed Kernel Extract (50ml per 10L water) every 7 days.
  2. **🧪 Chemical Treatment (کیمیائی ادویات - پاکستانی برانڈز):**
     - Active Ingredient: *Mancozeb 75% WP + Metalaxyl 8%*
     - Recommended Local Brands: *Ridomil Gold (Syngenta), Score 250 EC (Syngenta), Nativo (Bayer)*
     - Safety: Wear gloves, 7-day pre-harvest waiting interval (PHI).
  3. **⚖️ Spray Dosage Calculator Tab:**
     - Input field area: `[ 3 ] [ Acres (ایکڑ) ▾ ]`
     - Auto Calculation:
       - Required Water: `300 Liters (15 Knapsack Tanks of 20L)`
       - Required Chemical: `750 Grams (50g per Tank)`
- **Action Footer:**
  - `📲 Send Report to Agronomist on WhatsApp` | `📸 Scan Another Leaf (نیا اسکین)`

```
+------------------------------------------------------+
|  <- Back to Home                        [💾 Saved]   |
|                                                      |
|  +------------------------------------------------+  |
|  | 🔴 Early Blight (اگیتا جھلسائو)                 |  |
|  | Crop: Tomato | Confidence: 96.8% | Latency: 24ms|  |
|  +------------------------------------------------+  |
|                                                      |
|     +------------------------------------------+     |
|     |  [ 📷 Original ]   [ 🔥 Grad-CAM Heatmap]|     |
|     |  +------------------------------------+  |     |
|     |  |       [ Leaf Photo with Red        |  |     |
|     |  |         Heatmap on Lesions ]       |  |     |
|     |  +------------------------------------+  |     |
|     +------------------------------------------+     |
|                                                      |
|  [         🔊 سنیں (Listen Audio Report) ▶         ] |
|                                                      |
|  [ 🌿 Organic ]  [ 🧪 Chemical ]  [ ⚖️ Spray Dosage ]|
|  +------------------------------------------------+  |
|  | Active Ingredient: Mancozeb 75% WP              |  |
|  | Local Brands: Ridomil Gold (Syngenta), Nativo  |  |
|  | Spray 250g per 100L water per Acre.            |  |
|  +------------------------------------------------+  |
|                                                      |
|  [ 📲 Send Report to Agronomist on WhatsApp        ] |
|  [ 📸 Scan Another Leaf (نیا اسکین)                ] |
+------------------------------------------------------+
```

---

### Screen 5: Field Diary & Scan History
- **Filter Chips:** `All Scans` | `Cotton` | `Wheat` | `Tomato` | `Diseased Only`
- **Diary Cards:** Each card displays leaf thumbnail, Grad-CAM indicator, crop/disease title (UR/EN), date, time, and severity badge.
- 1-tap view full report or share to WhatsApp.

---

### Screen 6: Disease Encyclopedia
- **Search Bar:** Real-time search in English or Urdu.
- **Crop Category Filters:** Grid of crop icons (Wheat, Rice, Cotton, Tomato, Potato, Apple, Citrus).
- **Disease Cards:** Complete listing of crop diseases with symptom descriptions, clear photo examples, causal agents, and preventive crop rotation advice.
