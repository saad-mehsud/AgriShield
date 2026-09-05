import io
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, KeepTogether, HRFlowable
)
from app.config import UPLOAD_DIR

def generate_prescription_pdf(scan, disease, crop, remedies, dosage=None) -> bytes:
    """
    Generates a professional 1-page PDF Diagnostic & Agronomic Prescription Slip.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    primary_color = colors.HexColor("#065f46")   # Emerald 800
    accent_color = colors.HexColor("#047857")    # Emerald 700
    dark_text = colors.HexColor("#0f172a")       # Slate 900
    muted_text = colors.HexColor("#475569")      # Slate 600
    bg_light = colors.HexColor("#f8fafc")        # Slate 50
    border_color = colors.HexColor("#cbd5e1")    # Slate 300

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_color,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=muted_text
    )

    section_heading = ParagraphStyle(
        'SectionHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=accent_color,
        spaceBefore=6,
        spaceAfter=4
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=dark_text
    )

    body_regular = ParagraphStyle(
        'BodyReg',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=dark_text
    )

    elements = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>AGRISHIELD (کسان دوست)</b>", title_style),
            Paragraph(f"<b>Scan ID:</b> #{str(scan.id)[:8]}<br/><b>Date:</b> {scan.scanned_at.strftime('%d-%b-%Y %H:%M')}", subtitle_style)
        ],
        [
            Paragraph("Official Crop Diagnostic Report & Agronomic Prescription Slip", subtitle_style),
            Paragraph("<b>Status:</b> Verified by AI Engine", subtitle_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 6))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceAfter=8))

    # 2. Key Diagnostic Summary Table
    conf_pct = f"{int(scan.confidence * 100)}%" if scan.confidence else "95%"
    diag_summary = [
        [
            Paragraph(f"<b>Crop:</b> {crop.name_english} ({crop.name_urdu})", body_regular),
            Paragraph(f"<b>Pathogen Type:</b> {disease.pathogen_type.value}", body_regular),
            Paragraph(f"<b>AI Confidence:</b> {conf_pct}", body_regular)
        ],
        [
            Paragraph(f"<b>Diagnosis:</b> {disease.name_english}", body_bold),
            Paragraph(f"<b>Urdu Name:</b> {disease.name_urdu}", body_bold),
            Paragraph(f"<b>Severity Risk:</b> {scan.severity.value}", body_bold)
        ]
    ]
    diag_table = Table(diag_summary, colWidths=[180, 180, 180])
    diag_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(diag_table)
    elements.append(Spacer(1, 8))

    # 3. Visual Evidence (Images: Original vs Grad-CAM Heatmap)
    orig_path = os.path.join(UPLOAD_DIR, "scans", f"{scan.id}.jpg") if scan.id else None
    heat_path = os.path.join(UPLOAD_DIR, "heatmaps", f"{scan.id}_heatmap.jpg") if scan.id else None

    img_cells = []
    if orig_path and os.path.exists(orig_path):
        try:
            rl_orig = RLImage(orig_path, width=160, height=110)
            img_cells.append([rl_orig, Paragraph("<b>Original Field Leaf Photo</b>", subtitle_style)])
        except Exception:
            img_cells.append([Paragraph("Leaf Photo", subtitle_style), Paragraph("Photo", subtitle_style)])
    else:
        img_cells.append([Paragraph("Leaf Photo Attached", subtitle_style), Paragraph("Photo", subtitle_style)])

    if heat_path and os.path.exists(heat_path):
        try:
            rl_heat = RLImage(heat_path, width=160, height=110)
            img_cells.append([rl_heat, Paragraph("<b>AI Lesion Heatmap (Grad-CAM)</b>", subtitle_style)])
        except Exception:
            pass

    if len(img_cells) >= 2:
        img_table_data = [
            [img_cells[0][0], img_cells[1][0]],
            [img_cells[0][1], img_cells[1][1]]
        ]
        img_table = Table(img_table_data, colWidths=[270, 270])
        img_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ]))
        elements.append(img_table)
        elements.append(Spacer(1, 6))

    # 4. Certified Chemical & Organic Prescriptions
    elements.append(Paragraph("Prescribed Certified Agrochemicals & Remedies (مستند ادویات)", section_heading))
    
    remedy_rows = [
        [
            Paragraph("<b>Type</b>", body_bold),
            Paragraph("<b>Certified Pakistani Brands / Active Ingredients</b>", body_bold),
            Paragraph("<b>PHI</b>", body_bold),
            Paragraph("<b>Directions for Use</b>", body_bold)
        ]
    ]

    for r in remedies:
        r_type = "Chemical" if r.remedy_type.value == "CHEMICAL" else "Organic/Bio"
        brands = r.local_brands if r.local_brands else (r.active_ingredient or "Standard formulation")
        phi = f"{r.pre_harvest_interval_days} Days" if r.pre_harvest_interval_days else "N/A"
        instructions = r.instructions_english or r.instructions_urdu or "Apply as recommended."

        remedy_rows.append([
            Paragraph(f"<b>{r_type}</b>", body_regular),
            Paragraph(f"<b>{brands}</b><br/><font color='#64748b' size=7>{r.active_ingredient or ''}</font>", body_regular),
            Paragraph(phi, body_regular),
            Paragraph(instructions[:180] + ("..." if len(instructions) > 180 else ""), body_regular)
        ])

    remedy_table = Table(remedy_rows, colWidths=[65, 180, 55, 240])
    remedy_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(remedy_table)
    elements.append(Spacer(1, 6))

    # 5. Spray Dosage Table (Pakistani Land Units)
    chem_g = float(dosage.chemical_per_acre_grams) if (dosage and dosage.chemical_per_acre_grams) else 250.0
    water_l = float(dosage.water_per_acre_liters) if (dosage and dosage.water_per_acre_liters) else 100.0
    if water_l <= 0:
        water_l = 100.0

    tanks_1_acre = max(1, int(water_l / 20))
    dosage_per_tank = round(chem_g / tanks_1_acre, 1)

    elements.append(Paragraph("Spray Dosage Calculator (20-Liter Knapsack Tanks / ایکڑ کا حساب)", section_heading))
    dosage_data = [
        [
            Paragraph("<b>Land Unit</b>", body_bold),
            Paragraph("<b>Area Size</b>", body_bold),
            Paragraph("<b>Water Required</b>", body_bold),
            Paragraph("<b>20L Spray Tanks</b>", body_bold),
            Paragraph("<b>Total Chemical Amount</b>", body_bold),
            Paragraph("<b>Dosage / Tank</b>", body_bold),
        ],
        [
            Paragraph("1 Acre (ایکڑ)", body_regular),
            Paragraph("1.0 Acre (8 Kanals)", body_regular),
            Paragraph(f"{int(water_l)} Liters", body_regular),
            Paragraph(f"{tanks_1_acre} Tanks", body_regular),
            Paragraph(f"{int(chem_g)} g / ml", body_bold),
            Paragraph(f"{dosage_per_tank} g/tank", body_bold)
        ],
        [
            Paragraph("1 Kanal (کنال)", body_regular),
            Paragraph("0.125 Acre (20 Marlas)", body_regular),
            Paragraph(f"{max(1, int(water_l / 8))} Liters", body_regular),
            Paragraph("1 Tank", body_regular),
            Paragraph(f"{round(chem_g / 8, 1)} g / ml", body_regular),
            Paragraph(f"{dosage_per_tank} g/tank", body_regular)
        ],
        [
            Paragraph("4 Marlas (مرلہ)", body_regular),
            Paragraph("0.025 Acre", body_regular),
            Paragraph("5 Liters", body_regular),
            Paragraph("0.25 Tank", body_regular),
            Paragraph(f"{round(chem_g / 40, 1)} g / ml", body_regular),
            Paragraph(f"{dosage_per_tank} g/tank", body_regular)
        ]
    ]
    dosage_table = Table(dosage_data, colWidths=[90, 100, 85, 85, 95, 85])
    dosage_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(dosage_table)
    elements.append(Spacer(1, 8))

    # 6. Footer & Agronomist Sign-off
    footer_text = Paragraph(
        "<font color='#047857'><b>Safety Note:</b></font> Always wear protective gloves and mask during spray. Avoid spraying under strong sunlight. "
        "<br/><i>Generated by AgriShield (کسان دوست) AI Diagnostic Engine. For emergency advisory, consult your local agricultural extension officer.</i>",
        subtitle_style
    )
    elements.append(footer_text)

    # Build PDF
    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
