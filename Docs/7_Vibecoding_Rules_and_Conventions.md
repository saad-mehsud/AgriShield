# ⚡ Vibecoding Rules & Agent Engineering Conventions
## Project: AI-Powered Crop Disease Diagnostics & Decision Support System (AgriShield / Kisan Dost)

**Document Version:** 3.0.0 (Python FastAPI + React/Next.js Architecture)  
**Purpose:** Strict architectural rules, design patterns, and constraints for AI Coding Agents when generating and modifying code.

---

## 1. Golden Rules for Python FastAPI Backend

1. **Strict Type Annotations & Pydantic v2:**
   - Every FastAPI route function must have explicit type hints and response models (`response_model=DiagnosisResponse`).
   - Never return unvalidated raw dictionaries directly.
2. **PyTorch Memory Management (`torch.no_grad()`):**
   - Always wrap inference routines in `with torch.no_grad():` to avoid accumulating computational graphs in RAM/VRAM.
   - Use `eval()` mode on the model before making predictions (`model.eval()`).
3. **Async / Sync Balance:**
   - For CPU-bound image transformations and PyTorch inference, run them inside a threadpool worker (`run_in_threadpool` or standard sync route) to prevent blocking FastAPI's async event loop.
4. **CORS & Static File Mounting:**
   - Ensure `CORSMiddleware` explicitly allows the frontend origin (`http://localhost:3000`).
   - Serve uploaded images via `app.mount("/static", StaticFiles(directory="static"), name="static")`.

---

## 2. Golden Rules for Frontend Web Client

1. **Strict TypeScript (No Lazy `any`):**
   - All API response types must match the Pydantic schemas defined in `Docs/5_Backend_and_Database_Schema.md` and `Docs/8_API_Contracts_and_Data_Specs.md`.
2. **No External CSS or Styled-Components:**
   - Use Tailwind CSS utility classes exclusively.
3. **i18n Localization Compliance:**
   - Never hardcode raw English strings in UI components.
   - Always route strings through the `useTranslation()` hook (e.g. `t('scanner.shutter_button')`).
4. **Mobile-First Touch Target Sizing:**
   - Primary buttons must have `min-h-[48px]` (recommended `min-h-[56px]`) and `min-w-[48px]` for rugged outdoor field usage.
5. **Text-to-Speech (TTS) & Audio Engine:**
   - Always check `typeof window !== 'undefined' && 'speechSynthesis' in window`.
   - For Urdu speech, set `utterance.lang = 'ur-PK'`. Provide a visual sound wave indicator during audio playback.

---

## 3. Standard FastAPI Route Handler Pattern

```python
# backend/app/routers/diagnose.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import DiagnosisResponse
from app.services.ml_service import predict_crop_disease
from app.services.storage_service import save_image_and_thumbnail
from app.models.models import DiagnosticScan, Disease

router = APIRouter(prefix="/api/v1", tags=["Diagnosis"])

@router.post("/diagnose", response_model=DiagnosisResponse, status_code=status.HTTP_200_OK)
async def diagnose_leaf(
    image: UploadFile = File(...),
    crop_hint: str = Form(None),
    latitude: float = Form(None),
    longitude: float = Form(None),
    db: Session = Depends(get_db)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")

    image_bytes = await image.read()
    
    # 1. Save Image & Thumbnail
    image_url, thumb_url = save_image_and_thumbnail(image_bytes)

    # 2. Run PyTorch Inference
    prediction, top3 = predict_crop_disease(image_bytes)

    # 3. Fetch Disease & Remedy from Database
    disease = db.query(Disease).filter(Disease.class_key == prediction["class_key"]).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease profile not found in knowledge base")

    # 4. Record Scan
    scan = DiagnosticScan(
        crop_id=disease.crop_id,
        disease_id=disease.id,
        confidence=prediction["confidence"],
        severity=disease.severity_default,
        image_url=image_url,
        thumbnail_url=thumb_url,
        latitude=latitude,
        longitude=longitude
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return DiagnosisResponse.from_orm_with_details(scan, disease)
```
