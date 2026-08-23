# 🎨 UI/UX Design Specification & Design System
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 1.0.0  
**Design Philosophy:** "One-Tap Agri-Simplicity" — High sunlight contrast, illiterate-friendly visual cues, audio-first assist, and 56px touch targets for rugged outdoor field usage.

---

## 1. Design Principles

1. **Sunlight-Readable High Contrast:** Bright outdoor glare washes out delicate pastels. The interface uses crisp off-whites (`#F8FAFC`), deep slate typography (`#0F172A`), and vibrant emerald greens (`#16A34A`).
2. **Icon & Visual First (Illiteracy-Aware):** Every key action is paired with universally recognizable agricultural pictograms (Leaf, Sun, Bug, Spray Can, Speaker, Shield) alongside localized Urdu/Pashto text.
3. **Audio as a First-Class Citizen:** Every diagnostic result, dosage calculation, and advisory tip features a prominent "Listen in Urdu" (سنیں) speaker button.
4. **Zero-Friction One-Tap Scan:** The user can launch the camera and receive a full diagnosis in under 3 taps from the home screen.

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

```
COLOR SWATCHES:
+-----------------------------------------------------------------------------------+
| [ #15803D ] Emerald 700   - Primary Brand & Action                                |
| [ #22C55E ] Green 500     - Healthy Crop / High Confidence                        |
| [ #F59E0B ] Amber 500     - Warning / Moderate Severity                           |
| [ #DC2626 ] Red 600       - Critical Disease / Urgent Action                      |
| [ #0F172A ] Slate 900     - High Contrast Text for Sunlight                       |
| [ #F8FAFC ] Slate 50      - Clean Non-Glare Canvas                                |
+-----------------------------------------------------------------------------------+
```

---

## 3. Typography & Regional Font Stack

### 3.1 Font Families
- **English / Latin:** `Inter`, `Outfit`, `-apple-system`, `sans-serif`
- **Urdu / Arabic Script:** `Noto Nastaliq Urdu`, `Noto Sans Arabic`, `Gulzar`, `sans-serif`
- **Pashto / Sindhi:** `Noto Sans Arabic`, `system-ui`

### 3.2 Type Scale

| Style Name | Size / Weight | Line Height | Application |
| :--- | :--- | :--- | :--- |
| **Display Hero** | `32px` / Bold (700) | `1.2` | Splash title, Primary disease diagnosis name |
| **Heading 1** | `24px` / SemiBold (600) | `1.3` | Section titles, Modal headers |
| **Heading 2** | `18px` / SemiBold (600) | `1.4` | Card titles, Tab headers |
| **Body Large** | `16px` / Regular (400) | `1.5` | Diagnosis instructions, Remedy text |
| **Body Small** | `14px` / Medium (500) | `1.4` | Dosage ratios, timestamps, metadata |
| **Caption / Badge** | `12px` / Bold (700) | `1.2` | Status tags, confidence percentages |

---

## 4. Screen-by-Screen Layout Specifications

### Screen 1: Splash & Language Selector
- **Header:** AgriShield (کسان دوست) Logo with wheat/leaf emblem.
- **Language Card Grid:** 4 large, high-contrast touch cards:
  - 🇵🇰 **اُردو (Urdu)** — Default selected
  - 🏴 **پښتو (Pashto)**
  - 🌊 **سنڌي (Sindhi)**
  - 🌐 **English**
- **Action:** Single prominent green button: *"Start Scanning / اسکین شروع کریں"* with haptic feedback.

```
+------------------------------------------+
|            🌾 AgriShield                 |
|             (کسان دوست)                  |
|    Select Your Language / زبان منتخب کریں|
|                                          |
|  +------------------+  +---------------+ |
|  |     اُردو        |  |    پښتو       | |
|  |    (Urdu)        |  |   (Pashto)    | |
|  +------------------+  +---------------+ |
|  +------------------+  +---------------+ |
|  |     سنڌي         |  |    English    | |
|  |   (Sindhi)       |  |   (Global)    | |
|  +------------------+  +---------------+ |
|                                          |
|  [     Continue / آگے بڑھیں ->     ]     |
+------------------------------------------+
```

---

### Screen 2: Main Dashboard (Home)
- **Top Bar:** Location tag (e.g. "📍 Multan, Punjab"), Language switch icon, Offline status pill (`🟢 Offline Ready`).
- **Weather & Disease Risk Alert Banner:** 
  - *"High Humidity Alert (85%): Fungal Blight Risk elevated for Tomatoes & Potatoes."*
- **Hero Scanner Card (Focal Point):**
  - Giant pulsing camera icon with animated viewfinder border.
  - Button text: **"📸 Scan Leaf Now / پتے کا معائنہ کریں"**
  - Quick action: "Or Upload from Gallery / یا گیلری سے منتخب کریں".
- **Quick Metric Row:**
  - `Total Scans (12)` | `Diseases Detected (3)` | `Healthy Crops (9)`
- **Recent Scans Carousel:** Horizontal card list with thumbnail, crop name, date, and status badge.
- **Quick Tools Grid:**
  - 📚 Disease Encyclopedia (بیماریوں کی لغت)
  - 🧪 Spray Dosage Calculator (دوائی کا حساب)
  - 👨‍🌾 Ask Agronomist (ماہر زراعت سے رابطہ)

---

### Screen 3: Camera Viewfinder & Scanner
- **Live Video Feed:** Fullscreen or 4:3 camera view.
- **Scanning Guideline Overlay:** Bounding box with leaf shape silhouette.
- **Real-Time Helper Tooltip:** 
  - *"Place diseased leaf inside box & hold steady / پتے کو فریم کے اندر لائیں"*
- **Lighting & Focus Indicator:** Auto-detects darkness and suggests turning on torch.
- **Controls Bar:**
  - ⚡ Flash/Torch Toggle
  - 🔄 Camera Flip (Back/Front)
  - 🖼️ Gallery Upload Button
  - ⚪ **Big Shutter Button (72x72px)** with green ring.

```
+------------------------------------------+
|  [X Close]        ⚡ Flash       🔄 Flip  |
|                                          |
|         +----------------------+         |
|         |   .--------------.   |         |
|         |  /    🌿 Leaf     \  |         |
|         |  \   Guideline    /  |         |
|         |   '--------------'   |         |
|         +----------------------+         |
|                                          |
|    💡 Good Lighting Detected (اچھی روشنی)|
|                                          |
|  [🖼️ Gallery]    ( 🔘 SHUTTER )    [ℹ️ Help]|
+------------------------------------------+
```

---

### Screen 4: Diagnostic Result & Action Center (Core Screen)
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
     - Step 2: Spray Neem Seed Kernel Extract (50g per Liter) every 7 days.
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
  - `💾 Save to Diary` | `📲 Share Report via WhatsApp` | `🔄 Scan Another Leaf`

```
+------------------------------------------+
|  <- Back to Home            [💾 Save Scan]|
|                                          |
|  +------------------------------------+  |
|  | 🔴 Early Blight (اگیتا جھلسائو)     |  |
|  | Crop: Tomato | Confidence: 96%     |  |
|  +------------------------------------+  |
|                                          |
|  [  🔊 سنیں (Listen Audio Report) ▶  ]   |
|                                          |
|  [ 🌿 Organic ] [ 🧪 Chemical ] [ ⚖️ Dosage ] |
|  +------------------------------------+  |
|  | Active Ingredient: Mancozeb 75% WP |  |
|  | Local Brands: Ridomil Gold / Score  |  |
|  | Mix 250g per 100L water per acre.  |  |
|  +------------------------------------+  |
|                                          |
|  [ 📲 Send to Agronomist on WhatsApp ]   |
|  [ 📸 Scan Another Leaf (نیا اسکین) ]    |
+------------------------------------------+
```

---

### Screen 5: Scan History & Field Diary
- **Filter Chips:** `All Scans` | `Cotton` | `Wheat` | `Tomato` | `Diseased Only`
- **Diary Cards:** Each card displays:
  - High-resolution leaf thumbnail
  - Crop & Disease title (English & Urdu)
  - Date & Time stamp + GPS locality tag
  - Sync Indicator: `☁️ Synced` or `💾 Local Only`
  - 1-tap delete and view full report buttons.

---

### Screen 6: Disease Encyclopedia (Offline Knowledge Base)
- **Search Bar:** Real-time search by crop name or disease name (in English or Urdu phonetic search).
- **Crop Category Filters:** Grid of crop icons (Wheat, Rice, Cotton, Tomato, Potato, Apple, Citrus).
- **Disease Cards:** Complete listing of 38+ plant diseases with symptom descriptions, clear photo examples, causal agents, and preventive crop rotation advice.

---

## 5. Micro-Interactions & Haptic Feedback

- **Shutter Press:** Triggers a 50ms vibration pulse (via `navigator.vibrate(50)`) and a quick shutter-flash animation.
- **Inference Complete:** Smooth accordion slide-in of the diagnosis card with a satisfying success chime.
- **Dosage Slider / Area Stepper:** Immediate reactive re-computation of water tank volume with numeric counter animations.
- **Offline Mode Indicator:** Subtle top banner that shifts from green (`Online`) to amber (`Offline Mode Active - Full Functionality Retained`).

---

## 6. Accessibility & Internationalization Rules

1. **RTL Support:** Full Right-To-Left layout mirroring when Urdu, Pashto, or Sindhi is active (`dir="rtl"`).
2. **Text Scaling:** Supports dynamic browser text enlargement up to 200% without breaking card layouts.
3. **Contrast Compliance:** All text tokens adhere to WCAG AAA contrast ratio ($\ge 7:1$) against card backgrounds.
