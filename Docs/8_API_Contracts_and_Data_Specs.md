# 🔌 API Contracts, FastAPI Specs & Data Schemas
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 3.0.0 (Python FastAPI Architecture)  
**Format:** OpenAPI 3.0 / FastAPI REST & Pydantic v2 Models  

---

## 1. REST API Endpoints Specification (FastAPI `/api/v1`)

### 1.1 `POST /api/v1/diagnose` (Primary Diagnostic Endpoint)
Accepts a multipart leaf image, performs PyTorch MobileNetV2 classification, queries localized remedies from the database, records the scan, and returns structured diagnosis and spray dosage numbers.

- **Request Headers:** `Content-Type: multipart/form-data`
- **Request Form Parameters:**
  - `image`: Binary file (JPEG, PNG, WebP $\le 10$MB) — **Required**
  - `crop_hint`: String (e.g. `"tomato"`, `"cotton"`) — *Optional*
  - `farmer_id`: String (e.g. `"usr_991823"`) — *Optional*
  - `latitude`: Float (e.g. `30.1575`) — *Optional*
  - `longitude`: Float (e.g. `71.5249`) — *Optional*

- **Response `200 OK` (JSON):**
  ```json
  {
    "scan_id": "scn_8819234",
    "image_url": "http://localhost:8000/static/uploads/scans/scn_8819234.webp",
    "thumbnail_url": "http://localhost:8000/static/uploads/thumbnails/thumb_scn_8819234.webp",
    "crop_name": "Tomato",
    "crop_name_urdu": "ٹماٹر",
    "disease_name": "Early Blight (Alternaria solani)",
    "disease_name_urdu": "اگیتا جھلسائو",
    "disease_name_pashto": "مخکینی سوځیدنه",
    "pathogen_type": "FUNGAL",
    "confidence": 0.965,
    "severity": "HIGH",
    "audio_urdu_text": "آپ کے ٹماٹر کے پودے میں اگیتا جھلسائو کی بیماری پائی گئی ہے۔ فوری طور پر نچلے متاثرہ پتوں کو کاٹ کر جلا دیں اور مینکوزیب یا ریڈومل گولڈ کا اسپرے کریں۔",
    "remedies": [
      {
        "remedy_type": "ORGANIC",
        "title_urdu": "قدرتی / دیسی علاج",
        "instructions_urdu": "پودے کے نچلے متاثرہ پتوں کو کاٹ کر کھیت سے دور دفن کریں یا جلائیں۔ نیم کا تیل 50 ملی لیٹر فی 10 لیٹر پانی میں ملا کر ہر 7 دن بعد اسپرے کریں۔",
        "active_ingredient": null,
        "local_brands": null,
        "pre_harvest_interval_days": 0,
        "safety_warning_urdu": null
      },
      {
        "remedy_type": "CHEMICAL",
        "title_urdu": "کیمیائی علاج اور مستند دوائیں",
        "instructions_urdu": "250 گرام فی 100 لیٹر پانی فی ایکڑ اسپرے کریں۔",
        "active_ingredient": "Mancozeb 75% WP + Metalaxyl 8% OR Difenoconazole",
        "local_brands": "Ridomil Gold (سنجینٹا), Score 250 EC, Nativo (بائر)",
        "pre_harvest_interval_days": 7,
        "safety_warning_urdu": "اسپرے کرتے وقت ماسک اور دستانے لازمی پہنیں۔ فصل توڑنے سے کم از کم 7 دن پہلے اسپرے روک دیں۔"
      }
    ],
    "dosage": {
      "chemical_per_acre_grams": 250.0,
      "water_per_acre_liters": 100.0,
      "knapsack_tank_ratio": 50.0,
      "application_method": "Foliar Spray"
    },
    "scanned_at": "2026-08-23T12:00:00Z"
  }
  ```

---

### 1.2 `GET /api/v1/scans` (Field Diary Scan History)
- **Query Parameters:** `page` (default 1), `limit` (default 20), `crop` (optional)
- **Response `200 OK`:**
  ```json
  {
    "total": 12,
    "page": 1,
    "scans": [
      {
        "id": "scn_8819234",
        "crop_name": "Tomato",
        "crop_name_urdu": "ٹماٹر",
        "disease_name": "Early Blight",
        "disease_name_urdu": "اگیتا جھلسائو",
        "confidence": 0.965,
        "severity": "HIGH",
        "thumbnail_url": "http://localhost:8000/static/uploads/thumbnails/thumb_scn_8819234.webp",
        "scanned_at": "2026-08-23T12:00:00Z"
      }
    ]
  }
  ```

---

### 1.3 `GET /api/v1/diseases` (Disease Encyclopedia)
- **Response `200 OK`:**
  ```json
  [
    {
      "id": "dis_01",
      "class_key": "Tomato___Early_blight",
      "crop_name": "Tomato",
      "crop_name_urdu": "ٹماٹر",
      "disease_name": "Early Blight",
      "disease_name_urdu": "اگیتا جھلسائو",
      "pathogen_type": "FUNGAL",
      "severity_default": "HIGH",
      "symptoms_urdu": "پرانے پتوں پر گول گہرے بھورے دھبے بنتے ہیں جو نشانہ بورڈ کی طرح دکھائی دیتے ہیں۔",
      "local_brands": "Ridomil Gold, Score, Nativo"
    }
  ]
  ```

---

### 1.4 `GET /api/v1/weather/alerts?lat=30.15&lng=71.52` (Disease Risk Alert)
- **Response `200 OK`:**
  ```json
  {
    "location": "Multan, Punjab",
    "temperature_c": 34.2,
    "humidity_percent": 82,
    "risk_level": "ELEVATED",
    "active_threats": [
      {
        "crop": "Tomato",
        "disease": "Early Blight",
        "reason": "High humidity (>80%) creates optimal fungal spore germination conditions."
      }
    ]
  }
  ```

---

## 2. Smart Spray Dosage Math Engine

$$\text{Total Water Required (Liters)} = \text{Field Area (Acres)} \times \text{Water Per Acre (L)}$$

$$\text{Knapsack Tanks (20L)} = \lceil \frac{\text{Total Water Required}}{20} \rceil$$

$$\text{Chemical Per Tank (Grams/ml)} = \frac{\text{Chemical Per Acre (Grams)}}{\text{Knapsack Tanks}}$$
