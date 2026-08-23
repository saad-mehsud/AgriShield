# ⚡ Vibecoding Rules & Agent Engineering Conventions
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 1.0.0  
**Purpose:** Strict architectural rules, design patterns, and constraints for AI Coding Agents when generating and modifying code.

---

## 1. Golden Rules for Vibecoding AgriShield

1. **Zero-Crash Resilience (Offline-First):**
   - Every network fetch must have an immediate IndexedDB or static JSON fallback.
   - If an API fails or the user is in airplane mode, the app must **NEVER throw an unhandled exception or display a blank white screen**.
2. **Strict TypeScript (No Lazy `any`):**
   - All diagnostic scan objects, ML tensors, disease metadata, and translation keys must have explicit interfaces located in `src/types/`.
3. **No External CSS or Styled-Components:**
   - Use Tailwind CSS exclusively. Do not write inline `style={{ ... }}` except for dynamic runtime values (e.g. dynamic meter percentage widths).
4. **i18n Localization Compliance:**
   - Never hardcode raw UI strings in English directly in TSX files.
   - Always route strings through the `useTranslation()` hook (e.g. `t('scanner.shutter_button')`).
5. **Mobile-First Touch Target Sizing:**
   - Primary buttons must have `min-h-[48px]` (recommended `min-h-[56px]`) and `min-w-[48px]` for rough outdoor field usage.

---

## 2. Directory & Component Architecture Rules

### 2.1 Component Separation Principle
- **`src/components/ui/`**: Pure presentation primitives (Button, Card, Badge, Modal, Tabs, Slider). Must be reusable, uncoupled from business state.
- **`src/components/scanner/`**: Hardware & camera-specific modules (Viewfinder, shutter, canvas frame grabber).
- **`src/components/diagnosis/`**: Diagnostic output, confidence gauges, audio player, remedy tabs, dosage calculator.
- **`src/components/diary/`**: Historical scan lists, filter chips, sync pills.
- **`src/components/layout/`**: Header, Bottom Nav, Language Switcher, Offline status banner.

### 2.2 State Management Rules
- **Global UI State:** Use **Zustand** for lightweight global states (e.g. current language, active camera stream, offline sync status).
- **Persistent Data State:** Use **Dexie.js (IndexedDB)** for all persistent scans, field notes, and cached disease profiles.
- **Server Cache:** Use Next.js Server Actions / TanStack Query for remote API communication.

---

## 3. Machine Learning & Client Inference Best Practices

```typescript
// 1. Always manage memory cleanly using tf.tidy() to prevent WebGL memory leaks
export async function runInference(model: tf.GraphModel | tf.LayersModel, imageElement: HTMLImageElement | HTMLCanvasElement) {
  const resultTensor = tf.tidy(() => {
    // Convert to Tensor
    const pixels = tf.browser.fromPixels(imageElement);
    // Normalize to [0, 1]
    const normalized = pixels.toFloat().div(255.0);
    // Bilinear resize to model input dimensions 224x224
    const resized = tf.image.resizeBilinear(normalized, [224, 224]);
    // Add batch dimension [1, 224, 224, 3]
    const batched = resized.expandDims(0);
    // Execute inference
    return model.predict(batched) as tf.Tensor;
  });

  const probabilities = await resultTensor.data();
  resultTensor.dispose(); // Free GPU/WASM memory immediately
  return probabilities;
}
```

---

## 4. Text-to-Speech (TTS) & Audio Engine Convention

- Always check `typeof window !== 'undefined' && 'speechSynthesis' in window`.
- Provide a visual audio wave animation when speech is active.
- Allow 1-tap cancellation if the farmer taps the button again while playing.
- For Urdu pronunciation, set `utterance.lang = 'ur-PK'`. If the client OS lacks an Urdu voice pack, fall back cleanly to phonetically generated audio or English voice without crashing.

---

## 5. UI Color & Accessibility Tokens

```typescript
// Standard severity color mapping utility
export function getSeverityBadge(severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL') {
  switch (severity) {
    case 'LOW':
      return { label: 'Low / ہلکا', bg: 'bg-green-100 text-green-800 border-green-300' };
    case 'MODERATE':
      return { label: 'Moderate / درمیانہ', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'HIGH':
    case 'CRITICAL':
      return { label: 'Severe / شدید', bg: 'bg-red-100 text-red-800 border-red-300' };
  }
}
```

---

## 6. Error Boundary & Fallback Standards

- **Camera Blocked / Not Supported:** Render a clean illustration + `Upload from Gallery` button + manual disease picker.
- **Model Load Delay:** Show a smooth pulsing progress bar (`"Loading AI Agronomist Engine... / ماڈل لوڈ ہو رہا ہے"`).
- **Corrupt Image / Non-Leaf:** Display helpful guidance card with visual examples of correct leaf framing vs bad framing.
