import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class PathogenEnum(str, enum.Enum):
    FUNGAL = "FUNGAL"
    BACTERIAL = "BACTERIAL"
    VIRAL = "VIRAL"
    PEST = "PEST"
    DEFICIENCY = "DEFICIENCY"
    HEALTHY = "HEALTHY"

class RemedyTypeEnum(str, enum.Enum):
    ORGANIC = "ORGANIC"
    CHEMICAL = "CHEMICAL"

class SeverityEnum(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Crop(Base):
    __tablename__ = "crops"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String, unique=True, index=True, nullable=False) # e.g. "tomato", "cotton"
    name_english = Column(String, nullable=False)
    name_urdu = Column(String, nullable=False)
    name_pashto = Column(String, nullable=True)
    name_sindhi = Column(String, nullable=True)
    category = Column(String, nullable=False) # "Cash Crop", "Vegetable", "Cereal", "Fruit"
    icon_url = Column(String, nullable=True)

    diseases = relationship("Disease", back_populates="crop", cascade="all, delete-orphan")
    scans = relationship("DiagnosticScan", back_populates="crop")

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    class_key = Column(String, unique=True, index=True, nullable=False) # e.g. "Tomato___Early_blight"
    name_english = Column(String, nullable=False)
    name_urdu = Column(String, nullable=False)
    name_pashto = Column(String, nullable=True)
    name_sindhi = Column(String, nullable=True)
    pathogen_type = Column(Enum(PathogenEnum), nullable=False)
    severity_default = Column(Enum(SeverityEnum), default=SeverityEnum.MODERATE)
    symptoms_english = Column(Text, nullable=False)
    symptoms_urdu = Column(Text, nullable=False)
    prevention_english = Column(Text, nullable=False)
    prevention_urdu = Column(Text, nullable=False)

    crop = relationship("Crop", back_populates="diseases")
    remedies = relationship("Remedy", back_populates="disease", cascade="all, delete-orphan")
    dosage_rules = relationship("DosageRule", back_populates="disease", cascade="all, delete-orphan")
    scans = relationship("DiagnosticScan", back_populates="disease")

class Remedy(Base):
    __tablename__ = "remedies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    disease_id = Column(String, ForeignKey("diseases.id"), nullable=False)
    remedy_type = Column(Enum(RemedyTypeEnum), nullable=False) # ORGANIC or CHEMICAL
    title_english = Column(String, nullable=False)
    title_urdu = Column(String, nullable=False)
    instructions_english = Column(Text, nullable=False)
    instructions_urdu = Column(Text, nullable=False)
    active_ingredient = Column(String, nullable=True) # e.g. "Mancozeb 75% WP"
    local_brands = Column(String, nullable=True) # e.g. "Ridomil Gold (Syngenta), Score 250 EC"
    pre_harvest_interval_days = Column(Integer, default=7)
    safety_warning_urdu = Column(String, nullable=True)

    disease = relationship("Disease", back_populates="remedies")

class DosageRule(Base):
    __tablename__ = "dosage_rules"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    disease_id = Column(String, ForeignKey("diseases.id"), nullable=False)
    chemical_per_acre_grams = Column(Float, nullable=False) # e.g. 250.0
    water_per_acre_liters = Column(Float, default=100.0)
    knapsack_tank_ratio = Column(Float, nullable=False) # e.g. 50.0g per 20L tank
    application_method = Column(String, default="Foliar Spray")

    disease = relationship("Disease", back_populates="dosage_rules")

class DiagnosticScan(Base):
    __tablename__ = "diagnostic_scans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    disease_id = Column(String, ForeignKey("diseases.id"), nullable=False)
    confidence = Column(Float, nullable=False)
    inference_latency_ms = Column(Float, default=24.0)
    severity = Column(Enum(SeverityEnum), nullable=False)
    image_url = Column(String, nullable=False)
    heatmap_url = Column(String, nullable=True) # Grad-CAM Heatmap Image URL / Data
    thumbnail_url = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    scanned_at = Column(DateTime, default=datetime.utcnow)

    crop = relationship("Crop", back_populates="scans")
    disease = relationship("Disease", back_populates="scans")

class OutbreakReport(Base):
    __tablename__ = "outbreak_reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    disease_id = Column(String, ForeignKey("diseases.id"), nullable=False)
    region = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    severity_level = Column(Enum(SeverityEnum), nullable=False)
    reported_at = Column(DateTime, default=datetime.utcnow)
