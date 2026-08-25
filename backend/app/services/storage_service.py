import os
import uuid
import base64
from PIL import Image
import io
from app.config import settings

def save_leaf_and_heatmap(image_bytes: bytes, heatmap_bytes_or_base64=None) -> tuple[str, str, str]:
    """
    Saves the original leaf image, generates a 150x150 thumbnail,
    and saves the Grad-CAM heatmap overlay.
    Returns relative / static URLs: (image_url, heatmap_url, thumbnail_url).
    """
    scan_uuid = str(uuid.uuid4())

    # Open PIL image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Save original image (max 1024x1024 to save disk)
    image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
    image_filename = f"{scan_uuid}.webp"
    image_path = os.path.join(settings.SCANS_DIR, image_filename)
    image.save(image_path, "WEBP", quality=85)
    image_url = f"/static/uploads/scans/{image_filename}"

    # Generate 150x150 thumbnail
    thumb = image.copy()
    thumb.thumbnail((150, 150), Image.Resampling.LANCZOS)
    thumb_filename = f"thumb_{scan_uuid}.webp"
    thumb_path = os.path.join(settings.THUMBNAILS_DIR, thumb_filename)
    thumb.save(thumb_path, "WEBP", quality=80)
    thumbnail_url = f"/static/uploads/thumbnails/{thumb_filename}"

    # Save Heatmap if provided
    heatmap_url = None
    if heatmap_bytes_or_base64:
        if isinstance(heatmap_bytes_or_base64, str) and heatmap_bytes_or_base64.startswith("data:image"):
            # Decode base64
            base64_data = heatmap_bytes_or_base64.split(",")[1]
            heatmap_bytes = base64.b64decode(base64_data)
        elif isinstance(heatmap_bytes_or_base64, bytes):
            heatmap_bytes = heatmap_bytes_or_base64
        else:
            heatmap_bytes = None

        if heatmap_bytes:
            hm_image = Image.open(io.BytesIO(heatmap_bytes)).convert("RGB")
            hm_filename = f"heatmap_{scan_uuid}.webp"
            hm_path = os.path.join(settings.HEATMAPS_DIR, hm_filename)
            hm_image.save(hm_path, "WEBP", quality=85)
            heatmap_url = f"/static/uploads/heatmaps/{hm_filename}"

    return image_url, heatmap_url, thumbnail_url
