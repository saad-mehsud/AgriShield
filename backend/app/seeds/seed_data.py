import os
import json
from sqlalchemy.orm import Session
from app.database import engine, Base
from app.models.models import Crop, Disease, Remedy, DosageRule, PathogenEnum, RemedyTypeEnum, SeverityEnum

def seed_database(db: Session):
    Base.metadata.create_all(bind=engine)

    json_path = os.path.join(os.path.dirname(__file__), "diseases_data.json")
    if not os.path.exists(json_path):
        print(f"⚠️ Seeds file not found at {json_path}")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Cache existing crops to avoid duplicate creation
    existing_crops = {c.slug: c for c in db.query(Crop).all()}
    existing_diseases = {d.class_key: d for d in db.query(Disease).all()}

    count_new_diseases = 0

    for item in data:
        crop_slug = item["crop_slug"]
        if crop_slug not in existing_crops:
            crop = Crop(
                slug=crop_slug,
                name_english=item["crop_name_en"],
                name_urdu=item["crop_name_ur"],
                name_pashto=item.get("crop_name_ps"),
                category=item["category"]
            )
            db.add(crop)
            db.commit()
            db.refresh(crop)
            existing_crops[crop_slug] = crop
        else:
            crop = existing_crops[crop_slug]

        class_key = item["class_key"]
        if class_key not in existing_diseases:
            disease = Disease(
                crop_id=crop.id,
                class_key=class_key,
                name_english=item["disease_name_en"],
                name_urdu=item["disease_name_ur"],
                name_pashto=item.get("disease_name_ps"),
                pathogen_type=PathogenEnum(item["pathogen_type"]),
                severity_default=SeverityEnum(item["severity_default"]),
                symptoms_english=item["symptoms_en"],
                symptoms_urdu=item["symptoms_ur"],
                prevention_english=item["prevention_en"],
                prevention_urdu=item["prevention_ur"]
            )
            db.add(disease)
            db.commit()
            db.refresh(disease)
            existing_diseases[class_key] = disease
            count_new_diseases += 1

            # Seed Remedies
            for r in item.get("remedies", []):
                remedy = Remedy(
                    disease_id=disease.id,
                    remedy_type=RemedyTypeEnum(r["type"]),
                    title_english=r.get("title_en", r["title_ur"]),
                    title_urdu=r["title_ur"],
                    instructions_english=r.get("instructions_en", r["instructions_ur"]),
                    instructions_urdu=r["instructions_ur"],
                    active_ingredient=r.get("active_ingredient"),
                    local_brands=r.get("local_brands"),
                    pre_harvest_interval_days=r.get("phi", 7),
                    safety_warning_urdu=r.get("warning_ur")
                )
                db.add(remedy)

            # Seed Dosage Rule
            dosage_data = item.get("dosage")
            if dosage_data:
                dosage_rule = DosageRule(
                    disease_id=disease.id,
                    chemical_per_acre_grams=dosage_data.get("chemical_per_acre_grams", 200.0),
                    water_per_acre_liters=dosage_data.get("water_per_acre_liters", 100.0),
                    knapsack_tank_ratio=dosage_data.get("knapsack_tank_ratio", 40.0),
                    application_method=dosage_data.get("application_method", "Foliar Spray")
                )
                db.add(dosage_rule)

            db.commit()

    print(f"✅ Seeding complete: {count_new_diseases} new disease profiles registered.")

if __name__ == "__main__":
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
