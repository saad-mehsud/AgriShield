# 🔌 API Contracts, Edge ML Specs & Data Schemas
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 1.0.0  
**Format:** OpenAPI 3.0 / REST & TypeScript Interfaces  

---

## 1. Edge ML Inference Input/Output Contract

### 1.1 In-Browser Client Inference Contract
```typescript
export interface MLInferenceInput {
  imageSource: HTMLImageElement | HTMLCanvasElement | ImageData;
  modelConfig: {
    inputShape: [1, 224, 224, 3];
    normalization: 'zero_to_one' | 'minus_one_to_one';
  };
}

export interface MLInferenceOutput {
  topPrediction: {
    classKey: string;           // e.g. "Cotton___Leaf_Curl_Virus"
    cropSlug: string;           // e.g. "cotton"
    diseaseSlug: string;        // e.g. "leaf_curl_virus"
    confidence: number;         // 0.0 to 1.0 (e.g. 0.942)
  };
  top3Probabilities: Array<{
    classKey: string;
    confidence: number;
  }>;
  latencyMs: number;            // e.g. 340ms
  inferenceEngine: 'webgl' | 'wasm' | 'cpu';
}
```

---

## 2. REST API Endpoints Specification

### 2.1 `POST /api/diagnose` (Cloud Fallback Inference)
Used when client edge inference is unavailable or when high-resolution validation is requested.

- **Request Headers:** `Content-Type: multipart/form-data`
- **Request Body:**
  ```json
  {
    "image": "<binary_image_file>",
    "cropHint": "tomato",
    "farmerId": "usr_991823",
    "gps": {
      "latitude": 30.1575,
      "longitude": 71.5249
    }
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "scanId": "scn_8819234",
    "diagnosis": {
      "classKey": "Tomato___Early_blight",
      "cropName": "Tomato",
      "cropNameUrdu": "ٹماٹر",
      "diseaseName": "Early Blight",
      "diseaseNameUrdu": "اگیتا جھلسائو",
      "confidence": 0.965,
      "severity": "HIGH",
      "pathogenType": "FUNGAL",
      "audioUrduText": "آپ کے ٹماٹر کے پودے میں اگیتا جھلسائو کی بیماری پائی گئی ہے۔ فوری طور پر نچلے متاثرہ پتوں کو کاٹ کر جلا دیں اور مینکوزیب کا اسپرے کریں۔"
    },
    "remedies": {
      "organic": [
        "Infected leaves ko tod kar khet se door phenk dein ya jala dein.",
        "Neem oil 50ml per 10L water mein mix karke spray karein."
      ],
      "chemical": {
        "activeIngredient": "Mancozeb 75% WP + Metalaxyl 8%",
        "localBrands": "Ridomil Gold, Score 250 EC, Nativo",
        "instructions": "250g per 100L water per acre spray karein.",
        "preHarvestIntervalDays": 7
      }
    },
    "dosageRecommendation": {
      "chemicalPerAcreGrams": 250,
      "waterPerAcreLiters": 100,
      "tanksPerAcre": 5,
      "gramsPerTank": 50
    }
  }
  ```

---

### 2.2 `POST /api/sync/scans` (Batch Sync from IndexedDB)
- **Request Body:**
  ```json
  {
    "scans": [
      {
        "uuid": "8f7e2a10-3b4c-4e5f-9a1b-0c1d2e3f4a5b",
        "cropSlug": "cotton",
        "diseaseClassKey": "Cotton___Leaf_Curl_Virus",
        "confidence": 0.92,
        "severity": "CRITICAL",
        "thumbnailBase64": "data:image/jpeg;base64,...",
        "latitude": 28.4212,
        "longitude": 70.2989,
        "timestamp": 1724401200000
      }
    ]
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "syncedUuids": [
      "8f7e2a10-3b4c-4e5f-9a1b-0c1d2e3f4a5b"
    ],
    "serverTimestamp": 1724401205000
  }
  ```

---

### 2.3 `GET /api/weather/alerts?lat=30.15&lng=71.52` (Disease Risk Alert)
- **Response `200 OK`:**
  ```json
  {
    "location": "Multan, Punjab",
    "temperatureC": 34.2,
    "humidityPercent": 82,
    "riskLevel": "ELEVATED",
    "activeThreats": [
      {
        "crop": "Tomato",
        "disease": "Early Blight",
        "reason": "High humidity (>80%) creates optimal spore germination conditions."
      },
      {
        "crop": "Cotton",
        "disease": "Whitefly Vector / CLCuV",
        "reason": "Hot humid weather accelerates whitefly reproduction."
      }
    ]
  }
  ```

---

## 3. Disease Knowledge Base JSON Schema (`src/data/diseases.json`)

```json
[
  {
    "classKey": "Tomato___Early_blight",
    "cropSlug": "tomato",
    "cropName": "Tomato",
    "cropNameUrdu": "ٹماٹر",
    "cropNamePashto": "بانجان",
    "diseaseName": "Early Blight (Alternaria solani)",
    "diseaseNameUrdu": "اگیتا جھلسائو",
    "diseaseNamePashto": "مخکینی سوځیدنه",
    "pathogenType": "FUNGAL",
    "defaultSeverity": "HIGH",
    "symptoms": {
      "en": "Concentric dark brown rings on older leaves forming a 'target board' pattern, followed by leaf yellowing and drop.",
      "ur": "پرانے پتوں پر گول گہرے بھورے دھبے بنتے ہیں جو نشانہ بورڈ کی طرح دکھائی دیتے ہیں، بعد میں پتے پیلے ہو کر گر جاتے ہیں۔"
    },
    "organicRemedy": {
      "titleUrdu": "قدرتی / دیسی علاج",
      "stepsUrdu": [
        "پودے کے نچلے متاثرہ پتوں کو کاٹ کر کھیت سے دور دفن کریں یا جلائیں۔",
        "نیم کا تیل 50 ملی لیٹر فی 10 لیٹر پانی میں ملا کر ہر 7 دن بعد اسپرے کریں۔",
        "پودوں کو نیچے سے پانی دیں تاکہ پتے گیلے نہ رہیں۔"
      ]
    },
    "chemicalRemedy": {
      "titleUrdu": "کیمیائی علاج اور مستند دوائیں",
      "activeIngredient": "Mancozeb 75% WP + Metalaxyl 8% OR Difenoconazole",
      "localBrands": "Ridomil Gold (سنجینٹا), Score 250 EC, Nativo (بائر)",
      "dosagePerAcre": "250 گرام فی 100 لیٹر پانی فی ایکڑ",
      "preHarvestIntervalDays": 7,
      "safetyWarningUrdu": "اسپرے کرتے وقت ماسک اور دستانے لازمی پہنیں۔ فصل توڑنے سے کم از کم 7 دن پہلے اسپرے روک دیں۔"
    },
    "dosageConfig": {
      "chemicalGramsPerAcre": 250,
      "waterLitersPerAcre": 100,
      "gramsPer20LTank": 50,
      "tankCountPerAcre": 5
    }
  },
  {
    "classKey": "Cotton___Leaf_Curl_Virus",
    "cropSlug": "cotton",
    "cropName": "Cotton",
    "cropNameUrdu": "کپاس",
    "cropNamePashto": "پنبه",
    "diseaseName": "Cotton Leaf Curl Virus (CLCuV)",
    "diseaseNameUrdu": "کپاس کا پتا مڑاؤ وائرس",
    "diseaseNamePashto": "د پنبې د پاڼو تاویدو ویروس",
    "pathogenType": "VIRAL",
    "defaultSeverity": "CRITICAL",
    "symptoms": {
      "en": "Upward or downward leaf curling, vein thickening, and enation (leaf-like outgrowths) under the leaves caused by whitefly vector.",
      "ur": "پتے اوپر یا نیچے کی طرف مڑ جاتے ہیں، رگیں موٹی ہو جاتی ہیں اور پتے کی پشت پر چھوٹے پتوں نما ابھار بن جاتے ہیں۔ یہ بیماری سفید مکھی سے پھیلتی ہے۔"
    },
    "organicRemedy": {
      "titleUrdu": "قدرتی کنٹرول (سفید مکھی کے خلاف)",
      "stepsUrdu": [
        "کھیت میں پیلے چپکنے والے کارڈز (Yellow Sticky Traps) لگائیں تاکہ سفید مکھی پکڑی جا سکے۔",
        "تمباکو کا پانی اور صابن کا محلول صبح کے وقت اسپرے کریں۔"
      ]
    },
    "chemicalRemedy": {
      "titleUrdu": "سفید مکھی کا کیمیائی کنٹرول",
      "activeIngredient": "Pyriproxyfen OR Spirotetramat OR Dinotefuran",
      "localBrands": "Movento (بائر), Polo, Oshin (کنزو)",
      "dosagePerAcre": "125 تا 150 ملی لیٹر فی 100 لیٹر پانی",
      "preHarvestIntervalDays": 14,
      "safetyWarningUrdu": "سفید مکھی کے انڈوں اور بچوں پر اسپرے کا براہ راست اثر ہونا ضروری ہے۔"
    },
    "dosageConfig": {
      "chemicalGramsPerAcre": 150,
      "waterLitersPerAcre": 100,
      "gramsPer20LTank": 30,
      "tankCountPerAcre": 5
    }
  }
]
```

---

## 4. Smart Dosage Calculation Math Engine

$$\text{Total Water Required (Liters)} = \text{Field Area (Acres)} \times \text{Water Per Acre (L)}$$

$$\text{Knapsack Tanks (20L)} = \lceil \frac{\text{Total Water Required}}{20} \rceil$$

$$\text{Chemical Per Tank (Grams/ml)} = \frac{\text{Chemical Per Acre (Grams)}}{\text{Knapsack Tanks}}$$
