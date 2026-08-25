from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from app.models.models import PathogenEnum, RemedyTypeEnum, SeverityEnum

class RemedySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    remedy_type: RemedyTypeEnum
    title_english: Optional[str] = None
    title_urdu: str
    instructions_english: Optional[str] = None
    instructions_urdu: str
    active_ingredient: Optional[str] = None
    local_brands: Optional[str] = None
    pre_harvest_interval_days: Optional[int] = 7
    safety_warning_urdu: Optional[str] = None

class DosageSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    chemical_per_acre_grams: float
    water_per_acre_liters: float = 100.0
    knapsack_tank_ratio: float
    application_method: str = "Foliar Spray"

class TopPredictionItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    class_key: str
    confidence: float
    crop_name: Optional[str] = None
    disease_name: Optional[str] = None

class DiagnosisResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    scan_id: str
    image_url: str
    heatmap_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    crop_slug: str
    crop_name: str
    crop_name_urdu: str
    crop_name_pashto: Optional[str] = None
    disease_name: str
    disease_name_urdu: str
    disease_name_pashto: Optional[str] = None
    pathogen_type: PathogenEnum
    confidence: float
    inference_latency_ms: float
    severity: SeverityEnum
    audio_urdu_text: str
    symptoms_urdu: str
    prevention_urdu: str
    remedies: List[RemedySchema]
    dosage: Optional[DosageSchema] = None
    top3: Optional[List[TopPredictionItem]] = None
    scanned_at: datetime

class ScanListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    crop_name: str
    crop_name_urdu: str
    disease_name: str
    disease_name_urdu: str
    confidence: float
    severity: SeverityEnum
    image_url: str
    heatmap_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    scanned_at: datetime

class ScanListResponse(BaseModel):
    total: int
    page: int
    limit: int
    scans: List[ScanListItem]

class DiseaseListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    class_key: str
    crop_slug: str
    crop_name: str
    crop_name_urdu: str
    disease_name: str
    disease_name_urdu: str
    pathogen_type: PathogenEnum
    severity_default: SeverityEnum
    symptoms_urdu: str
    local_brands: Optional[str] = None

class DiseaseDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    class_key: str
    crop_slug: str
    crop_name: str
    crop_name_urdu: str
    disease_name: str
    disease_name_urdu: str
    disease_name_pashto: Optional[str] = None
    pathogen_type: PathogenEnum
    severity_default: SeverityEnum
    symptoms_english: str
    symptoms_urdu: str
    prevention_english: str
    prevention_urdu: str
    remedies: List[RemedySchema]
    dosage: Optional[DosageSchema] = None

class WeatherAlertItem(BaseModel):
    crop: str
    crop_urdu: str
    threat: str
    threat_urdu: str
    risk_level: str
    reason_urdu: str

class WeatherAlertsResponse(BaseModel):
    location: str
    temperature_c: float
    humidity_percent: int
    overall_risk: str
    alerts: List[WeatherAlertItem]
