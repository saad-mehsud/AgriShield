# 🔌 API Contracts, FastAPI Specs & Data Schemas
## Project: AgriShield (کسان دوست) — AI Crop Disease Diagnostics & Explainable Decision Support System

**Document Version:** 4.0.0 (Custom PyTorch ML + Explainable AI Edition)  
**Format:** OpenAPI 3.0 / FastAPI REST & Pydantic v2 Models  

---

## 1. REST API Endpoints Specification (FastAPI `/api/v1`)

### 1.1 `POST /api/v1/diagnose` (Primary Diagnostic & Explainable AI Endpoint)
Accepts a multipart leaf image, performs PyTorch MobileNetV3 classification, generates a Grad-CAM lesion heatmap overlay, queries localized Pakistani remedies, records the scan, and returns structured diagnosis and spray dosage numbers.

- **Request Headers:** `Content-Type: multipart/form-data`
- **Request Form Parameters:**
  - `image`: Binary file (JPEG, PNG, WebP $\le 10$MB) — **Required**
  - `crop_hint`: String (e.g. `"tomato"`, `"cotton"`) — *Optional*
  - `latitude`: Float (e.g. `28.4212`) — *Optional*
  - `longitude`: Float (e.g. `70.2989`) — *Optional*

- **Response `200 OK` (JSON):**
  ```json
  {
    "scan_id": "scn_8819234",
    "image_url": "http://localhost:8000/static/uploads/scans/scn_8819234.webp",
    "heatmap_url": "http://localhost:8000/static/uploads/heatmaps/heatmap_scn_8819234.webp",
    "thumbnail_url": "http://localhost:8000/static/uploads/thumbnails/thumb_scn_8819234.webp",
    "crop_name": "Tomato",
    "crop_name_urdu": "ٹماٹر",
    "disease_name": "Early Blight (Alternaria solani)",
    "disease_name_urdu": "اگیتا جھلسائو",
    "disease_name_pashto": "مخکینی سوځیدنه",
    "pathogen_type": "FUNGAL",
    "confidence": 0.968,
    "inference_latency_ms": 24.5,
    "severity": "HIGH",
    "audio_urdu_text": "آپ کے ٹماٹر کے پودے میں اگیتا جھلسائو کی بیماری پائی گئی ہے۔ فوری طور پر نچلے متاثرہ پتوں کو کاٹ کر جلا دیں اور ریڈومل گولڈ یا سکور کا اسپرے کریں۔",
    "remedies": [
      {
        "remedy_type": "ORGANIC",
        "title_urdu": "قدرتی علاج اور دیسی ٹوٹکے",
        "instructions_urdu": "پودے کے نچلے متاثرہ پتوں کو کاٹ کر کھیت سے دور دفن کریں یا جلائیں۔ نیم کا تیل 50 ملی لیٹر فی 10 لیٹر پانی میں ملا کر ہر 7 دن بعد اسپرے کریں۔",
        "active_ingredient": null,
        "local_brands": null,
        "pre_harvest_interval_days": 0,
        "safety_warning_urdu": null
      },
      {
        "remedy_type": "CHEMICAL",
        "title_urdu": "کیمیائی علاج (مستند پاکستانی برانڈز)",
        "instructions_urdu": "250 گرام فی 100 لیٹر پانی فی ایکڑ اسپرے کریں۔",
        "active_ingredient": "Mancozeb 75% WP + Metalaxyl 8%",
        "local_brands": "Ridomil Gold (سنجینٹا پاکستان), Score 250 EC, Nativo (بائر کراپ سائنس)",
        "pre_harvest_interval_days": 7,
        "safety_warning_urdu": "اسپرے کرتے وقت ماسک اور دستانے لازمی پہنیں۔ فصل چنائی سے 7 دن پہلے اسپرے بند کریں۔"
      }
    ],
    "dosage": {
      "chemical_per_acre_grams": 250.0,
      "water_per_acre_liters": 100.0,
      "knapsack_tank_ratio": 50.0,
      "application_method": "Foliar Spray"
    },
    "scanned_at": "2026-08-24T12:00:00Z"
  }
  ```

---

### 1.2 `GET /api/v1/scans` (Field Diary Scan History)
- **Query Parameters:** `page` (default 1), `limit` (default 20), `crop` (optional)
- **Response `200 OK`:**
  ```json
  {
    "total": 14,
    "page": 1,
    "scans": [
      {
        "id": "scn_8819234",
        "crop_name": "Tomato",
        "crop_name_urdu": "ٹماٹر",
        "disease_name": "Early Blight",
        "disease_name_urdu": "اگیتا جھلسائو",
        "confidence": 0.968,
        "severity": "HIGH",
        "image_url": "http://localhost:8000/static/uploads/scans/scn_8819234.webp",
        "heatmap_url": "http://localhost:8000/static/uploads/heatmaps/heatmap_scn_8819234.webp",
        "thumbnail_url": "http://localhost:8000/static/uploads/thumbnails/thumb_scn_8819234.webp",
        "scanned_at": "2026-08-24T12:00:00Z"
      }
    ]
  }
  ```

---

### 1.3 `GET /api/v1/diseases` (Disease Encyclopedia)
- **Response `200 OK`:** Returns full list of 38+ crop diseases with symptoms and local Pakistani remedies.

---

## 2. Pakistani Land Dosage Math Engine

$$\text{Total Water Required (Liters)} = \text{Field Area (Acres)} \times 100\text{ Liters}$$

$$\text{Knapsack Tanks (20L)} = \lceil \frac{\text{Total Water Required}}{20} \rceil$$

$$\text{Chemical Per 20L Tank (Grams/ml)} = \frac{\text{Total Chemical Per Acre (Grams)}}{\text{Knapsack Tanks}}$$

### Land Conversion Matrix (Pakistan Standard):
- $1\text{ Acre} = 8\text{ Kanals} = 160\text{ Marlas}$
- $1\text{ Kanal} = 0.125\text{ Acres} = 20\text{ Marlas}$
- $1\text{ Marla} = 0.00625\text{ Acres}$
