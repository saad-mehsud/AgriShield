import os
import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from app.main import app
from app.database import Base, engine, SessionLocal
from app.seeds.seed_data import seed_database
from app.services.gradcam_service import generate_gradcam_heatmap_overlay
from app.services.ml_service import predict_crop_disease_local

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()

client = TestClient(app)

def create_sample_leaf_image():
    img = Image.new("RGB", (224, 224), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "AgriShield" in data["app"]

def test_list_diseases():
    response = client.get("/api/diseases")
    assert response.status_code == 200
    diseases = response.json()
    assert len(diseases) > 0
    assert any(d["crop_slug"] == "cotton" for d in diseases)
    assert any(d["crop_slug"] == "tomato" for d in diseases)

def test_filter_diseases_by_crop():
    response = client.get("/api/diseases?crop=wheat")
    assert response.status_code == 200
    diseases = response.json()
    assert len(diseases) > 0
    assert all(d["crop_slug"] == "wheat" for d in diseases)

def test_weather_alerts():
    response = client.get("/api/weather/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "alerts" in data
    assert len(data["alerts"]) > 0

def test_local_ml_service():
    img_bytes = create_sample_leaf_image()
    res = predict_crop_disease_local(img_bytes)
    assert "class_key" in res
    assert res["confidence"] > 0.5
    assert len(res["top3"]) == 3

def test_gradcam_service():
    img_bytes = create_sample_leaf_image()
    hm_bytes = generate_gradcam_heatmap_overlay(img_bytes, "Tomato___Early_blight")
    assert len(hm_bytes) > 0
    # Verify valid image output
    hm_img = Image.open(io.BytesIO(hm_bytes))
    assert hm_img.size == (224, 224)

def test_diagnose_endpoint():
    img_bytes = create_sample_leaf_image()
    files = {"image": ("test_leaf.jpg", img_bytes, "image/jpeg")}
    response = client.post("/api/diagnose", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "scan_id" in data
    assert "image_url" in data
    assert "crop_name_urdu" in data
    assert "disease_name_urdu" in data
    assert "audio_urdu_text" in data
    assert "remedies" in data
    assert len(data["remedies"]) > 0

def test_scans_list_after_diagnose():
    response = client.get("/api/scans")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    assert len(data["scans"]) > 0
