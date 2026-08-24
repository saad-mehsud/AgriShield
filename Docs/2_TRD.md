# ⚙️ Technical Requirements Document (TRD)
## Project: AgriShield (کسان دوست) — AI Crop Disease Diagnostics & Explainable Decision Support System

**Document Version:** 4.0.0 (Custom PyTorch ML + Explainable AI Edition)  
**Status:** Approved for Implementation  
**Architecture:** Decoupled Client-Server Web Application with Python FastAPI & Custom PyTorch ML + Grad-CAM Engine  

---

## 1. System Architecture Overview

AgriShield utilizes a **Self-Hosted Machine Learning Pipeline**. The frontend web client handles camera acquisition, image upload, interactive Grad-CAM heatmap visualization, and Urdu voice audio playback. The backend is a **Python FastAPI** service hosting the PyTorch Computer Vision model, the Explainable AI (Grad-CAM) module, and the Pakistani Agronomic Knowledge Base.

```
+------------------------------------------------------------------------------------+
|                             FRONTEND WEB APPLICATION                               |
|                                                                                    |
|  +------------------------------------------------------------------------------+  |
|  |                 Next.js / React (TypeScript + Tailwind CSS)                  |  |
|  |     • Camera Viewfinder (HTML5 MediaDevices / File API)                      |  |
|  |     • Explainable AI Viewer (Interactive Original vs. Grad-CAM Slider)       |  |
|  |     • Multilingual UI (Urdu, Pashto, Sindhi, English) & RTL Layout Engine    |  |
|  |     • Browser Web Speech API (Urdu Voice Narration)                          |  |
|  |     • Pakistani Land Unit Dosage Calculator (Acre / Kanal / Marla)           |  |
|  +------------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------------+
                                      │
                                      │ HTTPS / Multipart POST & REST APIs
                                      ▼
+------------------------------------------------------------------------------------+
|                         PYTHON FASTAPI BACKEND SERVICE                             |
|                                                                                    |
|  +------------------------------------------------------------------------------+  |
|  |                     FastAPI Application (Uvicorn / AsyncIO)                  |  |
|  |     • `POST /api/v1/diagnose` (Image Ingestion, ML Inference & Grad-CAM)     |  |
|  |     • `GET  /api/v1/diseases` (Disease Encyclopedia & Remedies)              |  |
|  |     • `GET/POST /api/v1/scans` (Field Diary Scan Persistence)                |  |
|  |     • `GET  /api/v1/weather/alerts` (Live Weather Disease Risk Index)        |  |
|  +------------------------------------------------------------------------------+  |
|         │                                      │                                   |
|         ▼ (Image Bytes)                        ▼ (Relational Queries)              |
|  +---------------------------+       +------------------------------------+        |
|  |   PyTorch ML & XAI Engine |       |    SQLAlchemy 2.0 / Pydantic v2    |        |
|  |  • MobileNetV3 / ResNet   |       |    (SQLite / PostgreSQL Database)  |        |
|  |  • TorchVision Transforms |       |  • Farmer Scans & Heatmaps         |        |
|  |  • Grad-CAM Heatmap Gen   |       |  • Pakistani Agrochemical Registry |        |
|  +---------------------------+       +------------------------------------+        |
+------------------------------------------------------------------------------------+
```

---

## 2. Tech Stack Specification & Rationale

| Layer | Technology | Selection Rationale & Advantages |
| :--- | :--- | :--- |
| **Backend Framework** | **Python 3.10+ / FastAPI (Uvicorn)** | High-performance asynchronous execution, native Pydantic v2 data validation, automated interactive Swagger UI (`/docs`), and seamless Python ML integration. |
| **Machine Learning Core** | **PyTorch + TorchVision** | Industry-standard deep learning framework; enables native transfer learning, custom classification heads, and gradient-based interpretability. |
| **Explainable AI (XAI)** | **Grad-CAM (OpenCV + PyTorch)** | Generates gradient-weighted visual heatmaps showing the exact leaf lesions that triggered the diagnosis. |
| **Image Processing** | **Pillow (PIL) + TorchVision Transforms** | Fast image resizing, EXIF normalization, and tensor conversions. |
| **Database & ORM** | **SQLAlchemy 2.0 / SQLite / PostgreSQL** | Type-safe relational database management for scan history, localized Pakistani chemical brands, and organic remedies. |
| **Frontend Framework** | **Next.js 14/15 / React + TypeScript** | Component modularity, instant page transitions, strict typing, and high developer velocity. |
| **Styling & UI System** | **Tailwind CSS + Lucide Icons** | Utility-first CSS, high sunlight glare contrast tokens, and responsive mobile-first layouts. |
| **Audio / Speech** | **Web Speech API (`SpeechSynthesis`)** | Native browser speech synthesis with Urdu/English voice synthesis at zero operational cost. |

---

## 3. Machine Learning & Computer Vision Specifications

### 3.1 Model Architecture (MobileNetV3-Large Backbone)
- **Input Dimensions:** `[1, 3, 224, 224]` (Normalized via ImageNet Mean `[0.485, 0.456, 0.406]` & Std `[0.229, 0.224, 0.225]`).
- **Feature Extractor:** Inverted Residual blocks with Hard-Swish activation and Squeeze-and-Excitation (SE) attention.
- **Classifier Head:** Linear layer mapped to 38+ crop-disease classes with Softmax probability distribution.
- **Model Weight Size:** $\approx 15.2\text{ MB}$ (INT8/FP32).
- **Inference Time:** $\approx 18\text{–}28\text{ ms}$ on standard multi-core CPU.

---

## 4. Explainable AI (Grad-CAM) Mathematical Engine

### 4.1 Grad-CAM Computation Formula
To compute the localization map $L_{\text{Grad-CAM}}^c$ for class $c$:

1. **Gradient Extraction:** Compute the gradient of the score for class $c$ ($y^c$) with respect to feature activation map $A^k$ of the final convolutional layer:
   $$\alpha_k^c = \overbrace{\frac{1}{Z} \sum_{i} \sum_{j}}^{\text{Global Average Pooling}} \frac{\partial y^c}{\partial A_{i,j}^k}$$

2. **Weighted Combination & Rectified Linear Activation:**
   $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left( \sum_{k} \alpha_k^c A^k \right)$$

3. **Color Overlay:** The activation map is upsampled to $224 \times 224$, normalized between $[0, 1]$, converted to a Jet/Turbo colormap, and blended with the original leaf photo ($60\%$ leaf $+ 40\%$ heatmap).

```python
# backend/app/services/gradcam_service.py
import torch
import cv2
import numpy as np

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.hook_layers()

    def hook_layers(self):
        def forward_hook(module, input, output):
            self.activations = output
        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0]

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)

    def generate_heatmap(self, input_tensor, class_idx=None):
        self.model.eval()
        output = self.model(input_tensor)
        
        if class_idx is None:
            class_idx = torch.argmax(output, dim=1).item()

        self.model.zero_grad()
        loss = output[0, class_idx]
        loss.backward()

        # Compute weights via Global Average Pooling
        pooled_gradients = torch.mean(self.gradients, dim=[0, 2, 3])
        activations = self.activations[0]

        for i in range(activations.shape[0]):
            activations[i, ...] *= pooled_gradients[i]

        heatmap = torch.mean(activations, dim=0).squeeze().detach().cpu().numpy()
        heatmap = np.maximum(heatmap, 0) # ReLU
        heatmap /= np.max(heatmap) + 1e-8 # Normalize
        return heatmap
```

---

## 5. Security, Scalability & Performance Benchmarks

### 5.1 Performance Targets
- **Model Inference Time:** $\le 30$ ms on standard CPU.
- **Grad-CAM Generation:** $\le 45$ ms on standard CPU.
- **End-to-End API Round-Trip:** $\le 300$ ms on 4G connection.
- **Operational Cost:** **$0.00 / month** (Zero third-party API dependencies).

### 5.2 Pakistani Market Adaptations
- **Land Units:** Native mathematical conversions for 1 Acre = 8 Kanals = 160 Marlas.
- **Sprayer Standard:** Calibrated for 16-Liter and 20-Liter knapsack sprayers commonly used by Pakistani farmers.
