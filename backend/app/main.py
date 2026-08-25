import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seeds.seed_data import seed_database
from app.routers import diagnose, diseases, scans, weather

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed Pakistani agricultural database
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic (if needed)

# Initialize FastAPI App with lifespan
app = FastAPI(
    title="🌾 AgriShield (کسان دوست) API",
    description="Self-Hosted AI Crop Disease Diagnostics, Explainable AI (Grad-CAM) & Decision Support System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow frontend running on localhost:3000 or any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static File Directory for leaf scans and Grad-CAM heatmaps
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# Include API Routers with clean /api/* routes
app.include_router(diagnose.router)
app.include_router(diseases.router)
app.include_router(scans.router)
app.include_router(weather.router)

@app.get("/")
def root():
    return {
        "app": "AgriShield (کسان دوست) API",
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs",
        "colab_gpu_connected": bool(settings.COLAB_ML_URL)
    }
