# Design System: AI Crop Disease Analyzer (AgriShield / Kisan Dost)
**Project ID:** crop-disease-analyzer-v3

## 1. Visual Theme & Atmosphere
The design atmosphere is characterized by **"One-Tap Agri-Simplicity"** and **"Sunlight-Resistant Outdoor Utility."** Built specifically for rugged agricultural field conditions under bright sunlight glare, the visual aesthetic pairs clean, purposeful whitespace with rich natural earth and foliage tones. 

The mood is reassuring, clear, and unburdened by unnecessary visual noise. Farmers in distress over potential crop failure are greeted with immediate visual feedback, calming organic greens, and prominent audio readouts. High-contrast typography and large, thumb-friendly touch surfaces ensure effortless one-handed operation even with dust-covered hands or under direct outdoor glare.

---

## 2. Color Palette & Roles

* **Lush Evergreen / Primary Forest Emerald (`#15803D`):**
  * **Role:** Primary brand identity, primary call-to-action (CTA) buttons, active navigation states, and confirmation triggers.
* **Vibrant Leaf Sprout Green (`#22C55E`):**
  * **Role:** Healthy crop status badges, confidence meters, active camera viewfinder reticle, and positive diagnostic results.
* **Rich Loam / Organic Soil Earth (`#78350F`):**
  * **Role:** Organic & biological remedy badges, traditional herbal preparation cards, and field diary category headers.
* **Sun-Baked Harvest Amber / Caution Gold (`#F59E0B`):**
  * **Role:** Moderate disease severity tags, weather vulnerability alerts (e.g., high humidity fungal risk), and precautionary warnings.
* **Critical Pathogen Crimson / Blight Alert Red (`#DC2626`):**
  * **Role:** Severe disease danger indicators, urgent pathogen warning banners, and critical chemical pre-harvest interval alerts.
* **High-Sunlight Anti-Glare Slate Canvas (`#F8FAFC`):**
  * **Role:** Global application background, engineered to resist solar glare and prevent optical wash-out on budget mobile screens in direct sunlight.
* **Pure Crisp Milk Surface (`#FFFFFF`):**
  * **Role:** Elevated diagnosis cards, modal sheets, tab containers, and bottom action bars.
* **Deep Obsidian Slate / Primary Charcoal Typography (`#0F172A`):**
  * **Role:** High-contrast primary headers, disease titles, and vital diagnostic results ensuring maximum optical contrast (WCAG AAA compliant).
* **Weathered River Slate / Secondary Muted Charcoal (`#475569`):**
  * **Role:** Supporting descriptions, secondary subtitles, chemical active ingredient names, and timestamps.
* **Soft Agricultural Mist Border (`#E2E8F0`):**
  * **Role:** Subtle structural container borders, tab dividers, and card outlines that organize dense agronomic data without clutter.

---

## 3. Typography Rules

### 3.1 Font Families
* **English / Latin Script:** `Inter`, `Outfit`, `-apple-system`, `sans-serif` (Clean geometric sans with open apertures and high legibility at glanceable sizes).
* **Urdu & Arabic Script:** `Noto Nastaliq Urdu`, `Noto Sans Arabic`, `Gulzar`, `sans-serif` (Graceful baseline flow with distinct diacritics and proportional spacing designed for rural language comprehension).
* **Pashto & Sindhi Regional Scripts:** `Noto Sans Arabic`, `system-ui` (Full native bidirectional Arabic script support).

### 3.2 Type Scale & Weight Roles
* **Display Hero (`32px` / Bold 700 / Leading `1.2`):** Primary disease diagnosis name (e.g., *"Early Blight / اگیتا جھلسائو"*).
* **Section Heading 1 (`24px` / SemiBold 600 / Leading `1.3`):** Main screen headers, dashboard greeting, and modal titles.
* **Card & Module Heading 2 (`18px` / SemiBold 600 / Leading `1.4`):** Treatment section headers, dosage calculator title, and encyclopedia categories.
* **Body Regular (`16px` / Regular 400 / Leading `1.6`):** Step-by-step organic remedies, spray instructions, and advisory text. Line height is deliberately generous to ensure clean separation of Urdu nastaliq ligatures.
* **Body Small / Data Caption (`14px` / Medium 500 / Leading `1.5`):** Tank mixing ratios, metric indicators, severity tags, and scan timestamps.

---

## 4. Component Stylings

* **Buttons & Action Triggers:**
  * **Primary Shutter Action:** Giant floating circular trigger (`72px × 72px`) featuring a pure white core encased in a pulsating Vibrant Leaf Sprout (`#22C55E`) ring, offering unmistakable visual affordance.
  * **Primary Call-to-Action Buttons:** Generously rounded pill contours (`rounded-2xl` / `rounded-full`) with a minimum outdoor touch height of `56px` (`min-h-[56px]`). Coated in Lush Evergreen (`#15803D`) with bold white text, subtle downward press tactile response (`active:scale-98`).
  * **Audio / Voice Readout Bar:** Prominent pill-shaped container (`rounded-full`) featuring a loudspeaker pictogram (`🔊 سنیں`), soundwave animation bar, and emerald highlight, providing 1-tap localized speech playback.
  * **Secondary / Ghost Buttons:** Softly rounded corners (`rounded-xl`), framed in Soft Agricultural Mist (`#E2E8F0`) stroke over a pure white card backdrop, with deep slate typography.

* **Cards & Containers:**
  * **Diagnostic Summary Card:** Generously rounded corners (`rounded-2xl` / 16px radius), crisp white surface (`#FFFFFF`), whisper-soft diffused elevation shadow (`shadow-sm` / `0 2px 8px rgba(15, 23, 42, 0.06)`), and a subtle `1px` mist border (`#E2E8F0`).
  * **Remedy Tabbed Segmented Switch:** Pill-shaped pill-container (`rounded-xl`, background `#F1F5F9`) with smooth toggle transitions between *🌿 Organic (قدرتی علاج)* and *🧪 Chemical (کیمیائی ادویات)* tabs.
  * **Laser Scanner Overlay Frame:** Rectangular leaf framing viewfinder with rounded edges (`rounded-2xl`), semi-transparent darkened backdrop (`rgba(15, 23, 42, 0.6)`), and an animated neon emerald laser scanning bar traveling vertically.

* **Inputs & Forms:**
  * **Dosage Acreage & Unit Selectors:** Pill-style input blocks with generous tactile `+` / `–` stepper buttons (`min-h-[48px]`), clear `16px` numeric text, surrounded by a subtle mist border (`#E2E8F0`) that transitions to a focused emerald glow (`ring-2 ring-emerald-500`).
  * **Encyclopedia Search Bar:** Pill-shaped input container (`rounded-full`, `min-h-[52px]`) with leading magnifying lens icon, clear button, and dual English/Urdu placeholder typography.

* **Status Badges & Chips:**
  * **Severity Indicators:** Pill-shaped tags (`rounded-full`, `px-3 py-1 text-xs font-semibold`) using tinted background washes with high-contrast saturated text:
    * *Healthy:* Mint Wash (`#DCFCE7`) + Forest Green Text (`#15803D`)
    * *Moderate Risk:* Amber Wash (`#FEF3C7`) + Amber Brown Text (`#B45309`)
    * *Severe Infection:* Rose Wash (`#FEE2E2`) + Crimson Danger Text (`#DC2626`)

---

## 5. Layout Principles

* **One-Handed Mobile Ergonomics:** All primary interaction points (camera shutter, voice readout button, remedy tabs, WhatsApp advisory trigger) are anchored in the bottom 60% "natural thumb zone" for mobile screens.
* **Whitespace & Density Strategy:** Generous padding (`16px` to `20px` screen gutters) prevents accidental mis-taps on rugged field touchscreens while maintaining compact, scannable data hierarchy for dosages and pesticide steps.
* **Sunlight Contrast Hierarchy:** Critical diagnosis elements utilize high-contrast pairings (Dark Slate `#0F172A` on Off-White `#F8FAFC`) with a minimum 7:1 contrast ratio, ensuring immediate legibility under 10,000+ lux ambient daylight.
* **Bidirectional Layout (LTR / RTL):** Full symmetrical support for both Left-to-Right (English) and Right-to-Left (Urdu, Pashto, Sindhi) flows, including mirrored navigation chevrons, voice playback bars, and dosage stepper alignments.
