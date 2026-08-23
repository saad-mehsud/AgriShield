# 🌾 AgriShield (کسان دوست) — Master Documentation Suite
## AI-Powered Crop Disease Diagnostics & Decision Support System

Welcome to the comprehensive documentation repository for **AgriShield (کسان دوست)**. This suite of documents is specifically tailored for **Vibecoding** (rapid, autonomous AI-assisted software development) to build a **Decoupled Web Application with a Python FastAPI & PyTorch ML Cloud Backend**.

---

## 📚 Documentation Index

| # | Document | File Link | Primary Purpose & Key Contents |
| :-: | :--- | :--- | :--- |
| **1** | **PRD** (Product Requirements Document) | [1_PRD.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/1_PRD.md) | Product vision, target farmer personas, problem statement, MoSCoW feature scope, and success OKRs. |
| **2** | **TRD** (Technical Requirements Document) | [2_TRD.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/2_TRD.md) | Python FastAPI + PyTorch ML architecture, Next.js/React frontend stack, tech stack comparison, and performance benchmarks. |
| **3** | **UI/UX Design Specification** | [3_UI_UX_Design.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/3_UI_UX_Design.md) | Color palette, sunlight-readable tokens, typography (Inter & Noto Nastaliq Urdu), animated laser scanning state, and screen wireframes. |
| **4** | **App Flow & State Machine** | [4_App_Flow.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/4_App_Flow.md) | Navigation topology, sitemap, Mermaid sequence diagrams, FastAPI upload state machines, and error recovery flows. |
| **5** | **Backend & Database Schema** | [5_Backend_and_Database_Schema.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/5_Backend_and_Database_Schema.md) | SQLAlchemy 2.0 ORM models (SQLite/PostgreSQL), Pydantic v2 schemas, ER diagrams, and Pillow image storage pipeline. |
| **6** | **Implementation Plan** | [6_Implementation_Plan.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/6_Implementation_Plan.md) | Decoupled `backend/` and `frontend/` directory tree, 7-phase agent execution roadmap, verification commands, and acceptance criteria. |
| **7** | **Vibecoding Rules & Conventions** | [7_Vibecoding_Rules_and_Conventions.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/7_Vibecoding_Rules_and_Conventions.md) | AI coding constraints, Pydantic type safety, PyTorch `torch.no_grad()` memory rules, and TTS speech standards. |
| **8** | **API Contracts & Data Specs** | [8_API_Contracts_and_Data_Specs.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/8_API_Contracts_and_Data_Specs.md) | FastAPI OpenAPI endpoint specs (`/api/v1/diagnose`, `/api/v1/scans`, `/api/v1/diseases`), JSON schemas, and dosage math. |

---

## ⚡ Core Feature Highlights

1. **High-Performance Python FastAPI Backend:** Sub-second PyTorch MobileNetV2 computer vision classification executing on native Python AI infrastructure.
2. **Dual-Treatment Engine:** Immediate organic remedies ("Desi Totkay" / bio-pesticides) alongside verified local agrochemical brands (*Nativo, Ridomil Gold, Score, Movento*).
3. **Multilingual & Audio-First (TTS):** 1-tap Urdu (اردو), Pashto (پښتو), Sindhi (سنڌي), and English speech readout for illiterate and rural farmers.
4. **Smart Spray Dosage Calculator:** Converts field size (Acres, Kanals, Marlas) into exact knapsack tank counts and chemical grams to eliminate toxic pesticide overuse.
5. **Centralized Field Diary & History:** Centralized database storage of scan records with history tracking.
6. **Agronomist WhatsApp Bridge:** 1-click generation of formatted diagnostic reports to consult certified agronomists and local agriculture helplines.

---

## 🛠️ Tech Stack Specification

```
Frontend:            Next.js 14/15 / React + TypeScript + Tailwind CSS + Lucide Icons
Backend Framework:   Python 3.10+ / FastAPI (Uvicorn / AsyncIO)
Machine Learning:    PyTorch + TorchVision (MobileNetV2 / EfficientNet) + Pillow
Database & ORM:      SQLAlchemy 2.0 + SQLite / PostgreSQL + Pydantic v2
Speech Engine:       Web Speech API (SpeechSynthesis)
Documentation:       FastAPI Swagger UI auto-served at `/docs`
```

---

## 🚀 How to Kickstart the Vibecoding Build

When you are ready to begin implementation, prompt your AI agent with:
> *"Read `Docs/6_Implementation_Plan.md` and `Docs/7_Vibecoding_Rules_and_Conventions.md`, then execute Phase 1: Python FastAPI Scaffolding, Database & 38+ Disease Seeding."*
