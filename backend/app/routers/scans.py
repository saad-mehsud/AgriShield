from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import DiagnosticScan
from app.schemas.schemas import ScanListResponse, ScanListItem
from app.services.pdf_service import generate_prescription_pdf

router = APIRouter(prefix="/api/scans", tags=["Scans"])

@router.get("", response_model=ScanListResponse)
def list_scans(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    total = db.query(DiagnosticScan).count()
    scans = (
        db.query(DiagnosticScan)
        .order_by(DiagnosticScan.scanned_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    items = [
        ScanListItem(
            id=s.id,
            crop_name=s.crop.name_english,
            crop_name_urdu=s.crop.name_urdu,
            disease_name=s.disease.name_english,
            disease_name_urdu=s.disease.name_urdu,
            confidence=s.confidence,
            severity=s.severity,
            image_url=s.image_url,
            heatmap_url=s.heatmap_url,
            thumbnail_url=s.thumbnail_url,
            scanned_at=s.scanned_at
        )
        for s in scans
    ]

    return ScanListResponse(
        total=total,
        page=page,
        limit=limit,
        scans=items
    )

@router.get("/{scan_id}/pdf")
def get_scan_prescription_pdf(scan_id: str, db: Session = Depends(get_db)):
    """
    Generates and returns an official 1-page PDF Prescription Slip.
    """
    scan = db.query(DiagnosticScan).filter(DiagnosticScan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")

    disease = scan.disease
    crop = scan.crop
    remedies = disease.remedies
    dosage = disease.dosage_rules[0] if disease.dosage_rules else None

    pdf_bytes = generate_prescription_pdf(scan, disease, crop, remedies, dosage)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="AgriShield_Prescription_{scan_id[:8]}.pdf"'
        }
    )

@router.delete("/{scan_id}")
def delete_scan(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(DiagnosticScan).filter(DiagnosticScan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    db.delete(scan)
    db.commit()
    return {"success": True, "deleted_id": scan_id}
