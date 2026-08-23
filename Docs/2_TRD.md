# ⚙️ Technical Requirements Document (TRD)
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 3.0.0 (Python FastAPI + React/Next.js Architecture)  
**Status:** Approved for Implementation (Vibecoding)  
**Architecture:** Decoupled Client-Server Web Application with Python FastAPI & PyTorch ML Backend  

---

## 1. System Architecture Overview

AgriShield follows a **Decoupled Client-Server Architecture**. The frontend web client handles user interaction, camera stream capture, and voice playback. The backend is a high-performance **Python FastAPI** service hosting the PyTorch Computer Vision inference pipeline, database ORM layer (SQLAlchemy / SQLite / PostgreSQL), and localized agronomic remedy knowledge graph.

```
+------------------------------------------------------------------------------------+
|                             FRONTEND WEB APPLICATION                               |
|                                                                                    |
|  +------------------------------------------------------------------------------+  |
|  |                Next.js / React (TypeScript + Tailwind CSS + Lucide)          |  |
|  |     - Camera Viewfinder & File Uploader (HTML5 MediaDevices / File API)      |  |
|  |     - Multilingual UI (Urdu, Pashto, Sindhi, English) & RTL Layout Engine    |  |
|  |     - Client Web Speech API (Urdu Voice Narration)                           |  |
|  |     - Interactive Dosage Calculator & Field Diary Views                      |  |
|  +------------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------------+
                                      |
                                      | HTTPS / Multipart POST & JSON REST APIs
                                      v
+------------------------------------------------------------------------------------+
|                         PYTHON FASTAPI CLOUD BACKEND                               |
|                                                                                    |
|  +------------------------------------------------------------------------------+  |
|  |                     FastAPI Application (Uvicorn / AsyncIO)                  |  |
|  |     - Router: `POST /api/v1/diagnose` (Image Ingestion & ML Pipeline)        |  |
|  |     - Router: `GET  /api/v1/diseases` (Disease Encyclopedia & Remedies)      |  |
|  |     - Router: `GET/POST /api/v1/scans` (Field Diary Scan Persistence)        |  |
|  |     - Router: `GET  /api/v1/weather/alerts` (Live Weather Disease Risk)      |  |
|  |     - Interactive Swagger Docs at `/docs` (OpenAPI Spec)                     |  |
|  +------------------------------------------------------------------------------+  |
|         |                                      |                                   |
|         v (Raw Image Bytes)                    v (Relational Data Access)          |
|  +---------------------------+       +------------------------------------+        |
|  |   PyTorch ML Vision Engine|       |    SQLAlchemy 2.0 / Pydantic v2    |        |
|  |  - TorchVision Transforms |       |    (SQLite / PostgreSQL Database)  |        |
|  |  - MobileNetV2 / ResNet   |       |  - Farmer Users & Scan Records     |        |
|  |  - Softmax Classification |       |  - 38+ Disease Knowledge Graph     |        |
|  +---------------------------+       +------------------------------------+        |
+------------------------------------------------------------------------------------+
```

---

## 2. Tech Stack Specification & Rationale

| Layer | Technology | Selection Rationale & Advantages |
| :--- | :--- | :--- |
| **Backend Framework** | **Python 3.10+ / FastAPI (Uvicorn)** | High-performance asynchronous execution, native Pydantic v2 data validation, automated interactive Swagger UI (`/docs`), and seamless interoperability with Python ML libraries. |
| **Machine Learning Engine** | **PyTorch + TorchVision (or ONNX Runtime Python)** | Industry standard for computer vision; native GPU/CPU acceleration, pre-trained MobileNetV2/EfficientNet backbones, and zero-conversion Python inference. |
| **Image Processing** | **Pillow (PIL) + TorchVision Transforms** | High-speed image decoding, EXIF orientation handling, and tensor normalization. |
| **Database & ORM** | **SQLAlchemy 2.0 / SQLite / PostgreSQL + Alembic** | Type-safe ORM, relationship mapping, easy migration paths from local SQLite to cloud PostgreSQL. |
| **Frontend Framework** | **Next.js 14/15 / React + TypeScript** | Server rendering, component modularity, instant hydration, and rich developer velocity. |
| **Styling & UI System** | **Tailwind CSS + Lucide Icons** | Utility-first CSS, high sunlight contrast tokens, and accessible interactive primitives. |
| **Speech / Voice** | **Web Speech API (`SpeechSynthesis`)** | Native zero-latency browser speech synthesis with Urdu/English voice synthesis without external audio SDK costs. |

---

## 3. Deep Technical Comparison: Why FastAPI for Backend?

```
+---------------------+-------------------+---------------------+--------------------+
| Evaluation Metric   | Python FastAPI    | Node.js / Next API  | Django / Flask     |
+---------------------+-------------------+---------------------+--------------------+
| Native ML Support   | 🟢 Native PyTorch | 🔴 Needs C++ / TFjs | 🟡 Sync (Slower)   |
| Async Performance   | 🟢 Extreme (ASGI) | 🟢 Event Loop (V8)  | 🔴 WSGI Overhead   |
| Auto OpenAPI / Docs | 🟢 Built-in /docs | 🔴 Manual Swagger   | 🔴 Manual Plugins  |
| Data Validation     | 🟢 Pydantic v2    | 🟡 Zod (Extra step) | 🟡 Django Forms    |
| Vibecoding Speed    | ⚡ Very Fast      | ⚡ Fast             | ⚠️ Verbose setup   |
+---------------------+-------------------+---------------------+--------------------+
```

---

## 4. PyTorch Machine Learning Pipeline Specification

### 4.1 Tensor Preprocessing & Inference Protocol
```python
# backend/app/services/ml_service.py
import torch
from torchvision import transforms
from PIL import Image
import io

# Standard ImageNet normalization used by pre-trained MobileNetV2
transform_pipeline = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict_crop_disease(image_bytes: bytes, model: torch.nn.Module, class_names: list[str]):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    tensor = transform_pipeline(image).unsqueeze(0) # Shape: [1, 3, 224, 224]
    
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        
    top3_prob, top3_indices = torch.topk(probabilities, 3)
    
    top_pred = {
        "class_key": class_names[top3_indices[0].item()],
        "confidence": round(top3_prob[0].item(), 4)
    }
    
    top3 = [
        {"class_key": class_names[idx.item()], "confidence": round(prob.item(), 4)}
        for prob, idx in zip(top3_prob, top3_indices)
    ]
    
    return top_pred, top3
```

---

## 5. Security, Scalability & Performance Benchmarks

### 5.1 Performance Targets
- **FastAPI Inference Execution Time:** $\le 200$ms on CPU ($\le 35$ms on CUDA GPU).
- **Total Network Round-Trip:** $\le 1.0$s on standard 4G/3G network.
- **Concurrent Workers:** Uvicorn ASGI workers with multi-core parallelism.

### 5.2 Security & Middleware
- **CORS Configuration:** Explicit allowed origins (`http://localhost:3000`, production domain).
- **File Upload Protection:** Max file size validation (10MB limit) and MIME validation (`image/jpeg`, `image/png`, `image/webp`).
