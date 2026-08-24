# 🌾 AgriShield (کسان دوست) — Master Documentation Suite
## AI-Powered Crop Disease Diagnostics & Explainable Decision Support System

Welcome to the official documentation repository for **AgriShield (کسان دوست)**. This documentation suite outlines a **Self-Hosted, Real Machine Learning System** combining **Custom PyTorch Deep Learning (MobileNetV3)** with **Explainable AI (Grad-CAM Heatmaps)**, a **Python FastAPI** backend, and a **Next.js Web Frontend** specifically tailored for the Pakistani agricultural market ($0 API fees).

---

## 📚 Documentation Index

| # | Document | File Link | Primary Purpose & Key Contents |
| :-: | :--- | :--- | :--- |
| **1** | **PRD** (Product Requirements Document) | [1_PRD.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/1_PRD.md) | Product vision, Pakistani target farmer personas, problem statement, MoSCoW feature scope, and success OKRs. |
| **2** | **TRD** (Technical Requirements Document) | [2_TRD.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/2_TRD.md) | Python FastAPI + PyTorch ML architecture, Grad-CAM mathematical formulation, MobileNetV3-Large specs, and performance benchmarks. |
| **3** | **UI/UX Design Specification** | [3_UI_UX_Design.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/3_UI_UX_Design.md) | Sunlight-readable design system, Urdu/English typography, Grad-CAM interactive visual toggle, wireframes, and screen layouts. |
| **4** | **App Flow & State Machine** | [4_App_Flow.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/4_App_Flow.md) | Navigation topology, sitemap, Mermaid sequence diagrams, ML + Grad-CAM execution state machines, and error recovery flows. |
| **5** | **Backend & Database Schema** | [5_Backend_and_Database_Schema.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/5_Backend_and_Database_Schema.md) | SQLAlchemy 2.0 ORM models (SQLite/PostgreSQL), Pydantic v2 schemas, ER diagrams, and Grad-CAM heatmap storage pipeline. |
| **6** | **Implementation Plan** | [6_Implementation_Plan.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/6_Implementation_Plan.md) | Decoupled `backend/` (FastAPI) and `frontend/` directory tree, 7-day hackathon execution roadmap, and acceptance criteria. |
| **7** | **Vibecoding Rules & Conventions** | [7_Vibecoding_Rules_and_Conventions.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/7_Vibecoding_Rules_and_Conventions.md) | Strict coding standards, PyTorch `torch.no_grad()` memory rules, Grad-CAM gradient hooks, Pydantic type safety, and audio guidelines. |
| **8** | **API Contracts & Data Specs** | [8_API_Contracts_and_Data_Specs.md](file:///home/saadm/Crop%20Disease%20Analysis/Docs/8_API_Contracts_and_Data_Specs.md) | FastAPI OpenAPI endpoint specs (`/api/v1/diagnose`, `/api/v1/scans`, `/api/v1/diseases`), JSON schemas, and Pakistani land dosage math. |

---

## ⚡ Core Technical Pillars

1. **Custom PyTorch Deep Learning Backbone:** Sub-30ms CPU inference powered by MobileNetV3-Large pre-trained and fine-tuned on crop disease pathology.
2. **🔥 Explainable AI (Grad-CAM Heatmaps):** Visualizes neural network attention directly on infected leaf lesions, eliminating black-box AI skepticism for agronomists.
3. **100% Free & Self-Hosted:** Zero foreign currency API costs ($0/month), running completely locally on any server or laptop.
4. **Pakistani Agrochemical Prescriptions:** Verified commercial brands available in Pakistan (*Syngenta Pakistan, Bayer CropScience, FMC Pakistan, Ali Akbar Group, Kanzo*) paired with cost-effective organic "Desi Totkay".
5. **Pakistani Land Unit Dosage Math:** Converts **Acres (ایکڑ)**, **Kanals (کنال)**, and **Marlas (مرلہ)** into exact 16L/20L knapsack battery spray tanks.
6. **Native Urdu/Pashto/Sindhi Voice (TTS):** 1-tap speech synthesis speaking the diagnosis and spray instructions aloud for rural farmers.

---

## 🛠️ Tech Stack Specification

```
Backend Framework:   Python 3.10+ / FastAPI (Uvicorn / AsyncIO)
Machine Learning:    PyTorch + TorchVision (MobileNetV3-Large / EfficientNet-B0)
Explainable AI:      Grad-CAM (Gradient-weighted Class Activation Mapping) + OpenCV
Database & ORM:      SQLAlchemy 2.0 + SQLite / PostgreSQL + Pydantic v2
Frontend:            Next.js 14/15 / React + TypeScript + Tailwind CSS + Lucide Icons
Speech Engine:       Browser Web Speech API (SpeechSynthesis)
Documentation:       FastAPI Swagger UI auto-served at `/docs`
```
