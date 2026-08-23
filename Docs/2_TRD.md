# ⚙️ Technical Requirements Document (TRD)
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Vibecoding)  
**Architecture:** Offline-First Edge-Inference Progressive Web App (PWA)  

---

## 1. System Architecture Overview

AgriShield utilizes a **Decentralized Edge-First Architecture**. Diagnostic computer vision models execute directly on the client device inside a browser WebWorker utilizing WebAssembly (WASM) and WebGL hardware acceleration. An optional backend API provides synchronization, cloud backups, and secondary heavy-batch validation.

```
+------------------------------------------------------------------------------------+
|                               CLIENT BROWSER / PWA                                 |
|                                                                                    |
|  +------------------------------------------------------------------------------+  |
|  |                           Next.js 14/15 React UI                             |  |
|  |     (Tailwind CSS + Lucide Icons + Framer Motion + Multilingual i18n)        |  |
|  +------------------------------------------------------------------------------+  |
|         |                                      |                                   |
|         v                                      v                                   |
|  +---------------------------+       +------------------------------------+        |
|  |   Edge ML Inference       |       |  Local Storage Engine (Dexie.js)   |        |
|  |  (TensorFlow.js / ONNX)   |       |  - Offline Scan History (IndexedDB)|        |
|  |  - MobileNetV2 (Quantized)|       |  - 38+ Disease Knowledge Graph     |        |
|  |  - WebGL / WASM Backend   |       |  - Offline Agronomic Remedy Cache  |        |
|  +---------------------------+       +------------------------------------+        |
|         ^                                      | (Background Sync when online)     |
|         | ServiceWorker Cache                  v                                   |
+---------|--------------------------------------|-----------------------------------+
          |                                      |
          v                                      v
+------------------------------------------------------------------------------------+
|                               SERVER / BACKEND LAYER                               |
|                                                                                    |
|  +-----------------------------------+   +--------------------------------------+  |
|  |  Next.js Server Actions / API     |   |  Optional Python FastAPI Microservice|  |
|  |  - User Auth / Sync Endpoints     |   |  - High-Res Heavy Batch Inference    |  |
|  |  - Outbreak Aggregator            |   |  - Transfer Learning Retraining Pipe |  |
|  +-----------------------------------+   +--------------------------------------+  |
|                   |                                                                |
|                   v                                                                |
|  +------------------------------------------------------------------------------+  |
|  |                 PostgreSQL / SQLite Database (Prisma ORM)                    |  |
|  +------------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------------+
```

---

## 2. Tech Stack Specification & Rationale

| Layer | Technology | Selection Rationale & Alternatives Considered |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14/15 (App Router, React 18/19, TypeScript)** | Provides SSR/SSG for instant first-paint, API routes for backend logic, and zero-configuration PWA compilation. *Alternative Flutter/React Native rejected due to app store install barriers for rural farmers.* |
| **Styling & UI System** | **Tailwind CSS + Lucide Icons + Radix UI primitives** | Zero runtime CSS overhead, rapid vibecoding component assembly, accessible ARIA attributes out of the box, high contrast sunlight modes. |
| **Client Edge ML** | **TensorFlow.js (`@tensorflow/tfjs`) + WASM/WebGL backend** | Enables 100% offline inference on device in $< 600$ms without cloud egress costs or network reliance. Model size $< 5$ MB. |
| **Offline DB & State** | **Dexie.js (IndexedDB wrapper) + Zustand** | IndexedDB stores full base64 images and scan history with zero storage quota limits compared to 5MB localStorage. Zustand offers clean, boilerplate-free state. |
| **Audio / Speech** | **Web Speech API (`SpeechSynthesis`) + Fallback Audio Buffers** | Native device text-to-speech with Urdu/English voice synthesis without loading massive third-party voice SDKs. |
| **PWA & Offline ServiceWorker** | **Workbox / `next-pwa`** | Aggressively caches model shards (`model.json`, `weights.bin`), UI bundles, and knowledge base JSON for zero-downtime offline usage. |
| **Database & ORM** | **Prisma ORM with PostgreSQL / SQLite** | Type-safe schema generation, automatic migrations, and instant REST/Server Action integration. |
| **Backend Fallback** | **FastAPI / PyTorch (Optional)** | For server-side validation or batch agronomist processing. |

---

## 3. Deep Technical Comparison Matrix

### Why Next.js PWA + TensorFlow.js vs. Alternatives?

```
+------------------+---------------+--------------------+---------------------+
| Criteria         | Next.js + PWA | React Native / Java| Python Streamlit    |
+------------------+---------------+--------------------+---------------------+
| Zero-Install URL | ✅ YES (1-tap)| ❌ NO (App Store)  | ✅ YES              |
| Offline Edge ML  | ✅ YES (TF.js)| ✅ YES (TFLite)    | ❌ NO (Needs Server)|
| Low-end Android  | ✅ Fast (WASM)| ⚠️ Heavy APK size  | ❌ High Latency     |
| Vibecoding Speed | ⚡ Extreme    | ⚠️ Medium          | ⚡ Fast (Limited UI)|
| Multilingual TTS | ✅ Web Speech | ✅ Native TTS      | ⚠️ Server Audio     |
+------------------+---------------+--------------------+---------------------+
```

---

## 4. Machine Learning & Computer Vision Specifications

### 4.1 Base Model Architecture
- **Backbone:** MobileNetV2 (Alpha 0.35 / 0.50) or EfficientNet-Lite0.
- **Input Dimensions:** `[1, 224, 224, 3]` (Normalized float32 values between `[0, 1]` or `[-1, 1]`).
- **Quantization:** Post-Training Quantization (INT8 or Float16), reducing model footprint from ~14MB down to **~3.2MB**.
- **Output:** Probability distribution array across 38 crop disease classes via Softmax activation.

### 4.2 Dataset & Supported Classes
The core model is trained on the **PlantVillage dataset** (54,305 curated leaf images across 14 crop species) augmented with localized sub-continental agricultural classes:
1. `Apple___Apple_scab`
2. `Apple___Black_rot`
3. `Apple___Cedar_apple_rust`
4. `Apple___healthy`
5. `Corn_(maize)___Cercospora_leaf_spot`
6. `Corn_(maize)___Common_rust_`
7. `Corn_(maize)___Northern_Leaf_Blight`
8. `Corn_(maize)___healthy`
9. `Cotton___Leaf_Curl_Virus (CLCuV)` *(Localized)*
10. `Cotton___Bacterial_Blight` *(Localized)*
11. `Cotton___healthy`
12. `Grape___Black_rot`
13. `Grape___Esca_(Black_Measles)`
14. `Grape___Leaf_blight`
15. `Grape___healthy`
16. `Potato___Early_blight`
17. `Potato___Late_blight`
18. `Potato___healthy`
19. `Rice___Brown_Spot` *(Localized)*
20. `Rice___Leaf_Blast` *(Localized)*
21. `Rice___healthy`
22. `Tomato___Bacterial_spot`
23. `Tomato___Early_blight`
24. `Tomato___Late_blight`
25. `Tomato___Leaf_Mold`
26. `Tomato___Septoria_leaf_spot`
27. `Tomato___Spider_mites`
28. `Tomato___Target_Spot`
29. `Tomato___Tomato_Yellow_Leaf_Curl_Virus`
30. `Tomato___Tomato_mosaic_virus`
31. `Tomato___healthy`
*(Plus Citrus, Pepper, Peach, Strawberry, and Soybean classes).*

### 4.3 Client Preprocessing Pipeline
```typescript
// Preprocessing Flow:
// Image Element / Video Frame -> Canvas -> Crop Center Square -> Resize 224x224 -> Normalize -> Tensor3D
const tensor = tf.tidy(() => {
  const imgTensor = tf.browser.fromPixels(canvasElement);
  const normalized = imgTensor.toFloat().div(255.0);
  const resized = tf.image.resizeBilinear(normalized, [224, 224]);
  return resized.expandDims(0); // Shape [1, 224, 224, 3]
});
```

---

## 5. Offline Data Storage & Sync Architecture

### 5.1 Local Storage (Dexie.js IndexedDB Schema)
```typescript
export interface LocalScanRecord {
  id?: number;
  uuid: string;
  timestamp: number;
  cropName: string;
  diseaseName: string;
  diseaseNameUrdu: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high';
  thumbnailBase64: string; // Resized thumbnail for zero-lag list rendering
  imageBlob?: Blob;        // Full resolution image
  notes?: string;
  gpsCoords?: { latitude: number; longitude: number };
  isSynced: boolean;
}
```

### 5.2 Offline Synchronization Strategy
1. **Local-First Write:** Every scan is instantly written to IndexedDB with `isSynced: false`.
2. **Online Event Listener:** Window `online` event triggers background batch sync to `/api/sync/scans`.
3. **Optimistic UI:** Scan history displays immediately without awaiting network confirmation.

---

## 6. Audio & Multilingual Engine

### 6.1 Localization Matrix
- **Languages Supported:**
  - `ur` (Urdu - اُردو) -> Primary National Language
  - `ps` (Pashto - پښتو) -> Regional Language (KPK & Balochistan)
  - `sd` (Sindhi - سنڌي) -> Regional Language (Sindh)
  - `en` (English) -> Technical / Agronomist standard

### 6.2 Speech Synthesis Implementation
```typescript
export const speakDiagnosis = (text: string, lang: 'ur' | 'en' | 'ps') => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any ongoing playback
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ur' ? 'ur-PK' : lang === 'ps' ? 'ps-AF' : 'en-US';
  utterance.rate = 0.85; // Slightly slower pacing for agricultural clarity
  window.speechSynthesis.speak(utterance);
};
```

---

## 7. Performance & Security Safeguards

### 7.1 Web Performance Targets
- **Lighthouse Performance Score:** $\ge 95$
- **First Contentful Paint (FCP):** $\le 0.9$s
- **Cumulative Layout Shift (CLS):** $0.00$
- **Model Warmup Execution:** Background warm inference with zero tensor on app bootstrap to eliminate first-scan jank.

### 7.2 Security & Client Privacy
- **Client-Side Processing Guarantee:** Photos of farmer fields remain strictly on the local device unless the user explicitly opts into cloud backup or community reporting.
- **Image Sanitization:** Metadata (EXIF GPS) is parsed locally for user confirmation before optional anonymized outbreak mapping.
- **Content Security Policy (CSP):** Strict script sources; WebAssembly execution allowed via `'wasm-unsafe-eval'`.
