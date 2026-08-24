# ⚡ Vibecoding Rules & Agent Engineering Conventions
## Project: AgriShield (کسان دوست) — AI Crop Disease Diagnostics & Explainable Decision Support System

**Document Version:** 4.0.0 (Custom PyTorch ML + Explainable AI Edition)  
**Purpose:** Strict architectural rules, design patterns, and constraints for AI Coding Agents when generating and modifying code.

---

## 1. Golden Rules for Python FastAPI & PyTorch ML Backend

1. **PyTorch Inference & Grad-CAM Memory Safety:**
   - For standard inference, always use `model.eval()` and `with torch.no_grad():` to prevent memory bloat.
   - For Grad-CAM heatmap generation, enable gradient computation specifically on the forward/backward pass for the target convolutional layer, then immediately `.detach().cpu().numpy()` and clean up intermediate tensors.
2. **Strict Pydantic v2 Serialization:**
   - Every route must return a strongly-typed Pydantic model (`response_model=DiagnosisResponse`).
   - Never return unvalidated raw dictionaries.
3. **Static Media Serving:**
   - Original leaf images and Grad-CAM heatmap overlays must be stored in `backend/static/uploads/` and served via `app.mount("/static", StaticFiles(directory="static"), name="static")`.
4. **CORS Configuration:**
   - `CORSMiddleware` must explicitly allow `http://localhost:3000` with full support for GET, POST, and OPTIONS headers.

---

## 2. Golden Rules for Frontend Web Client

1. **Strict TypeScript (No `any` Types):**
   - Match all frontend response types with the FastAPI Pydantic schemas.
2. **Explainable AI (Grad-CAM) Visual UX:**
   - When displaying diagnosis results, always provide an interactive toggle to switch between the original leaf photo and the Grad-CAM heatmap overlay.
3. **Pakistani Land Unit Standard:**
   - Dosage calculations must support Acres (ایکڑ), Kanals (کنال), and Marlas (مرلہ) converting to standard 16L and 20L knapsack spray tanks.
4. **i18n Localization Compliance:**
   - Never hardcode raw English strings in UI components. Always use the `useTranslation()` hook (e.g. `t('scanner.shutter')`).
5. **Text-to-Speech (TTS) & Audio Standards:**
   - Always check `typeof window !== 'undefined' && 'speechSynthesis' in window`.
   - Set `utterance.lang = 'ur-PK'` for Urdu voice narration.

---

## 3. Standard FastAPI Diagnostic Route Pattern

```python
# backend/app/routers/diagnose.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import DiagnosisResponse
from app.services.ml_service import predict_crop_disease
from app.services.gradcam_service import generate_gradcam_overlay
from app.services.storage_service import save_leaf_and_heatmap
from app.models.models import DiagnosticScan, Disease

router = APIRouter(prefix="/api/v1", tags=["Diagnosis"])

@router.post("/diagnose", response_model=DiagnosisResponse, status_code=status.HTTP_200_OK)
async def diagnose_leaf(
    image: UploadFile = File(...),
    latitude: float = Form(None),
    longitude: float = Form(None),
    db: Session = Depends(get_db)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image file uploaded")

    image_bytes = await image.read()

    # 1. Run PyTorch Deep Learning Prediction
    prediction, top3 = predict_crop_disease(image_bytes)

    # 2. Generate Explainable AI (Grad-CAM) Heatmap
    heatmap_overlay_bytes = generate_gradcam_overlay(image_bytes, prediction["class_idx"])

    # 3. Save Files to Disk
    image_url, heatmap_url, thumb_url = save_leaf_and_heatmap(image_bytes, heatmap_overlay_bytes)

    # 4. Fetch Pakistani Remedies & Local Brand Names
    disease = db.query(Disease).filter(Disease.class_key == prediction["class_key"]).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease profile not found in knowledge base")

    # 5. Persist Diagnostic Scan
    scan = DiagnosticScan(
        crop_id=disease.crop_id,
        disease_id=disease.id,
        confidence=prediction["confidence"],
        inference_latency_ms=prediction["latency_ms"],
        severity=disease.severity_default,
        image_url=image_url,
        heatmap_url=heatmap_url,
        thumbnail_url=thumb_url,
        latitude=latitude,
        longitude=longitude
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return DiagnosisResponse.from_orm_with_details(scan, disease)
```
