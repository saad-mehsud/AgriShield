import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AgriShield (کسان دوست) Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agrishield.db")
    COLAB_ML_URL: str = os.getenv("COLAB_ML_URL", "") # e.g. "https://xxxx.ngrok-free.app"
    STATIC_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
    UPLOADS_DIR: str = os.path.join(STATIC_DIR, "uploads")
    SCANS_DIR: str = os.path.join(UPLOADS_DIR, "scans")
    HEATMAPS_DIR: str = os.path.join(UPLOADS_DIR, "heatmaps")
    THUMBNAILS_DIR: str = os.path.join(UPLOADS_DIR, "thumbnails")

settings = Settings()

# Ensure directories exist
os.makedirs(settings.SCANS_DIR, exist_ok=True)
os.makedirs(settings.HEATMAPS_DIR, exist_ok=True)
os.makedirs(settings.THUMBNAILS_DIR, exist_ok=True)
