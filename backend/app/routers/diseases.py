from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Disease, Crop
from app.schemas.schemas import DiseaseListItem, DiseaseDetailResponse, RemedySchema, DosageSchema

router = APIRouter(prefix="/api/diseases", tags=["Diseases"])

@router.get("", response_model=List[DiseaseListItem])
def list_diseases(
    crop: Optional[str] = Query(None, description="Filter by crop slug (e.g. cotton, wheat, tomato)"),
    search: Optional[str] = Query(None, description="Search term in English or Urdu"),
    db: Session = Depends(get_db)
):
    query = db.query(Disease).join(Crop)

    if crop:
        query = query.filter(Crop.slug == crop.lower())

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Disease.name_english.ilike(search_term)) |
            (Disease.name_urdu.like(search_term)) |
            (Crop.name_english.ilike(search_term)) |
            (Crop.name_urdu.like(search_term))
        )

    diseases = query.all()
    results = []
    for d in diseases:
        local_brands = d.remedies[0].local_brands if d.remedies else None
        results.append(
            DiseaseListItem(
                id=d.id,
                class_key=d.class_key,
                crop_slug=d.crop.slug,
                crop_name=d.crop.name_english,
                crop_name_urdu=d.crop.name_urdu,
                disease_name=d.name_english,
                disease_name_urdu=d.name_urdu,
                pathogen_type=d.pathogen_type,
                severity_default=d.severity_default,
                symptoms_urdu=d.symptoms_urdu,
                local_brands=local_brands
            )
        )
    return results

@router.get("/{disease_id}", response_model=DiseaseDetailResponse)
def get_disease_detail(disease_id: str, db: Session = Depends(get_db)):
    disease = db.query(Disease).filter((Disease.id == disease_id) | (Disease.class_key == disease_id)).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

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

    return DiseaseDetailResponse(
        id=disease.id,
        class_key=disease.class_key,
        crop_slug=disease.crop.slug,
        crop_name=disease.crop.name_english,
        crop_name_urdu=disease.crop.name_urdu,
        disease_name=disease.name_english,
        disease_name_urdu=disease.name_urdu,
        disease_name_pashto=disease.name_pashto,
        pathogen_type=disease.pathogen_type,
        severity_default=disease.severity_default,
        symptoms_english=disease.symptoms_english,
        symptoms_urdu=disease.symptoms_urdu,
        prevention_english=disease.prevention_english,
        prevention_urdu=disease.prevention_urdu,
        remedies=remedy_schemas,
        dosage=dosage_schema
    )
