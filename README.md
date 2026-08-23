# 🌾 AgriShield (کسان دوست) — Master Documentation Suite
## AI-Powered Crop Disease Diagnostics & Decision Support System

Welcome to the comprehensive documentation repository for **AgriShield (کسان دوست)**. This suite of documents is specifically tailored for **Vibecoding** (rapid, autonomous AI-assisted software development) to ensure clear architectural boundaries, strict types, and production-grade execution.

---

## 📚 Documentation Index

| # | Document | File Link | Primary Purpose & Key Contents |
| :-: | :--- | :--- | :--- |
| **1** | **PRD** (Product Requirements Document) | [1_PRD.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/1_PRD.md) | Product vision, target farmer personas, problem statement, MoSCoW feature scope, and success OKRs. |
| **2** | **TRD** (Technical Requirements Document) | [2_TRD.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/2_TRD.md) | Architecture overview, Next.js PWA + TensorFlow.js edge ML justification, tech stack matrix, and offline sync protocol. |
| **3** | **UI/UX Design Specification** | [3_UI_UX_Design.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/3_UI_UX_Design.md) | Color palette, sunlight-readable high-contrast tokens, typography (Inter & Noto Nastaliq Urdu), wireframes, and screen-by-screen layouts. |
| **4** | **App Flow & State Machine** | [4_App_Flow.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/4_App_Flow.md) | Navigation topology, sitemap, Mermaid sequence diagrams, diagnostic state machine, and offline recovery flows. |
| **5** | **Backend & Database Schema** | [5_Backend_and_Database_Schema.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/5_Backend_and_Database_Schema.md) | Local-first IndexedDB (Dexie.js) schema, PostgreSQL/SQLite Prisma ORM models, and ER diagrams. |
| **6** | **Implementation Plan** | [6_Implementation_Plan.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/6_Implementation_Plan.md) | Complete directory file tree, 7-phase agent execution roadmap, verification commands, and acceptance criteria. |
| **7** | **Vibecoding Rules & Conventions** | [7_Vibecoding_Rules_and_Conventions.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/7_Vibecoding_Rules_and_Conventions.md) | AI coding constraints, strict TypeScript rules, component separation, memory cleanup (`tf.tidy()`), and TTS standards. |
| **8** | **API Contracts & Data Specs** | [8_API_Contracts_and_Data_Specs.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/8_API_Contracts_and_Data_Specs.md) | OpenAPI endpoint specs, Edge ML Tensor contract, sample JSON knowledge base, and spray dosage formulas. |

---

## ⚡ Core Feature Highlights

1. **Sub-second Offline Edge Inference:** Browser-based TensorFlow.js MobileNetV2 model running directly via WebAssembly/WebGL on low-end smartphones.
2. **Dual-Treatment Engine:** Immediate organic remedies ("Desi Totkay" / bio-pesticides) alongside verified local agrochemical brands (e.g. *Nativo, Ridomil Gold, Score, Movento*).
3. **Multilingual & Audio-First (TTS):** 1-tap Urdu (اردو), Pashto (پښتو), Sindhi (سنڌي), and English speech readout for illiterate and rural farmers.
4. **Smart Spray Dosage Calculator:** Converts field size (Acres, Kanals, Marlas) into exact knapsack tank counts and chemical grams to eliminate toxic pesticide overuse.
5. **Field Diary & History:** Local-first IndexedDB storage with automatic background synchronization when internet connectivity resumes.
6. **Agronomist WhatsApp Bridge:** 1-click generation of formatted diagnostic reports to consult certified agronomists and local agriculture helplines.

---

## 🛠️ Recommended Tech Stack for Implementation

```
Frontend:            Next.js 14/15 (App Router) + React + TypeScript
Styling & UI:        Tailwind CSS + Lucide React Icons + Radix UI
Edge ML / CV:        TensorFlow.js (@tensorflow/tfjs) + MobileNetV2 (Quantized ~3.2MB)
Local Storage:       Dexie.js (IndexedDB wrapper)
PWA & Offline:       Workbox / next-pwa Service Worker
Speech Engine:       Web Speech API (SpeechSynthesis)
Cloud Database:      Prisma ORM with PostgreSQL / SQLite
```

---

## 🚀 How to Kickstart the Vibecoding Build

When you are ready to begin implementation, prompt your AI agent with:
> *"Read `Docs/6_Implementation_Plan.md` and `Docs/7_Vibecoding_Rules_and_Conventions.md`, then execute Phase 1: Project Scaffolding, PWA configuration, Design System & Localization."*
