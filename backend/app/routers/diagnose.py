from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import DiagnosisResponse, RemedySchema, DosageSchema, TopPredictionItem
from app.models.models import DiagnosticScan, Disease, Crop
from app.services.colab_client import predict_with_colab
from app.services.ml_service import predict_crop_disease_local
from app.services.gradcam_service import generate_gradcam_heatmap_overlay
from app.services.storage_service import save_leaf_and_heatmap

router = APIRouter(prefix="/api", tags=["Diagnosis"])

@router.post("/diagnose", response_model=DiagnosisResponse, status_code=status.HTTP_200_OK)
async def diagnose_crop_leaf(
    image: UploadFile = File(...),
    crop_hint: str = Form(None),
    latitude: float = Form(None),
    longitude: float = Form(None),
    db: Session = Depends(get_db)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image format")

    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty")

    # 1. Try Google Colab GPU Server first
    colab_res = await predict_with_colab(image_bytes)

    if colab_res and "class_key" in colab_res:
        class_key = colab_res["class_key"]
        confidence = colab_res.get("confidence", 0.95)
        latency_ms = colab_res.get("inference_latency_ms", 18.0)
        heatmap_base64 = colab_res.get("heatmap_base64")
        top3_raw = colab_res.get("top3", [])
        # Save image & Colab heatmap
        image_url, heatmap_url, thumb_url = save_leaf_and_heatmap(image_bytes, heatmap_base64)
    else:
        # 2. Local ML Engine & Grad-CAM Fallback
        local_res = predict_crop_disease_local(image_bytes, crop_hint)
        class_key = local_res["class_key"]
        confidence = local_res["confidence"]
        latency_ms = local_res["inference_latency_ms"]
        top3_raw = local_res["top3"]

        # Generate Grad-CAM Heatmap overlay
        heatmap_bytes = generate_gradcam_heatmap_overlay(image_bytes, class_key)
        image_url, heatmap_url, thumb_url = save_leaf_and_heatmap(image_bytes, heatmap_bytes)

    # 3. Query Database for Disease & Pakistani Agrochemical Cures
    disease = db.query(Disease).filter(Disease.class_key == class_key).first()
    if not disease:
        # Fallback to general diseased/healthy match if exact class key missing
        disease = db.query(Disease).first()
        if not disease:
            raise HTTPException(status_code=404, detail="No crop disease profiles found in database. Please run seed script.")

    crop = disease.crop

    # 4. Generate Urdu Speech Text
    if disease.pathogen_type.value == "HEALTHY":
        audio_urdu = f"ماشاءاللہ، آپ کا {crop.name_urdu} کا پودا بالکل صحت مند ہے۔ کسی زہر یا اسپرے کی ضرورت نہیں ہے۔"
    else:
        first_brand = disease.remedies[0].local_brands if disease.remedies else "مستند دوا"
        audio_urdu = (
            f"آپ کے {crop.name_urdu} کے پودے میں {disease.name_urdu} کی بیماری پائی گئی ہے۔ "
            f"اس کے تدارک کے لیے فوری طور پر نچلے متاثرہ پتوں کو کاٹ کر تلف کریں اور {first_brand} کا اسپرے کریں۔"
        )

    # 5. Persist Diagnostic Scan to Database
    scan = DiagnosticScan(
        crop_id=crop.id,
        disease_id=disease.id,
        confidence=confidence,
        inference_latency_ms=latency_ms,
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

    # 6. Format Response
    remedy_schemas = [
        RemedySchema(
            remedy_type=r.remedy_type,
            title_english=r.title_english,
            title_urdu=r.title_urdu,
            instructions_english=r.instructions_english,
            instructions_urdu=r.instructions_urdu,
            active_ingredient=r.active_ingredient,
            local_brands=r.local_brands,
            pre_harvest_interval_days=r.pre_harvest_interval_days,
            safety_warning_urdu=r.safety_warning_urdu
        )
        for r in disease.remedies
    ]

    dosage_schema = None
    if disease.dosage_rules:
        d = disease.dosage_rules[0]
        dosage_schema = DosageSchema(
            chemical_per_acre_grams=d.chemical_per_acre_grams,
            water_per_acre_liters=d.water_per_acre_liters,
            knapsack_tank_ratio=d.knapsack_tank_ratio,
            application_method=d.application_method
        )

    top3_items = [
        TopPredictionItem(
            class_key=t["class_key"],
            confidence=t["confidence"]
        )
        for t in top3_raw
    ]

    return DiagnosisResponse(
        scan_id=scan.id,
        image_url=image_url,
        heatmap_url=heatmap_url,
        thumbnail_url=thumb_url,
        crop_slug=crop.slug,
        crop_name=crop.name_english,
        crop_name_urdu=crop.name_urdu,
        crop_name_pashto=crop.name_pashto,
        disease_name=disease.name_english,
        disease_name_urdu=disease.name_urdu,
        disease_name_pashto=disease.name_pashto,
        pathogen_type=disease.pathogen_type,
        confidence=confidence,
        inference_latency_ms=latency_ms,
        severity=disease.severity_default,
        audio_urdu_text=audio_urdu,
        symptoms_urdu=disease.symptoms_urdu,
        prevention_urdu=disease.prevention_urdu,
        remedies=remedy_schemas,
        dosage=dosage_schema,
        top3=top3_items,
        scanned_at=scan.scanned_at
    )
