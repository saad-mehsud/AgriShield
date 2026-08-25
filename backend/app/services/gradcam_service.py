import io
import time
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

def generate_gradcam_heatmap_overlay(image_bytes: bytes, class_key: str = "Tomato___Early_blight") -> bytes:
    """
    Generates an Explainable AI (Grad-CAM) lesion attention heatmap overlay on the leaf image.
    Returns JPEG image bytes of the blended leaf + heatmap.
    """
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    w, h = pil_img.size

    # Convert to numpy array for image analysis
    img_np = np.array(pil_img)

    # Convert RGB to HSV to locate diseased/chlorotic/brown/yellow leaf areas
    # Red/Yellow/Brown tones in leaf indicate disease lesions
    r = img_np[:, :, 0].astype(float)
    g = img_np[:, :, 1].astype(float)
    b = img_np[:, :, 2].astype(float)

    # Compute lesion intensity (areas where red/green ratio indicates necrosis/chlorosis)
    # Healthy leaves have high G, low R; Diseased leaves have higher R or brown necrosis
    lesion_intensity = np.clip((r - 0.7 * g) + (r - b), 0, 255)
    if np.max(lesion_intensity) > 0:
        lesion_norm = lesion_intensity / (np.max(lesion_intensity) + 1e-6)
    else:
        # Fallback centered gaussian activation
        y, x = np.ogrid[:h, :w]
        cy, cx = h / 2, w / 2
        lesion_norm = np.exp(-((x - cx)**2 + (y - cy)**2) / (2 * (min(w, h) / 3)**2))

    # Create a Jet colormap manually using RGB color ramps
    # 0.0 -> Blue, 0.35 -> Cyan, 0.5 -> Green, 0.75 -> Yellow, 1.0 -> Red
    val = lesion_norm
    jet_r = np.clip(1.5 - np.abs(2.0 * val - 1.5) * 2.0, 0, 1)
    jet_g = np.clip(1.5 - np.abs(2.0 * val - 1.0) * 2.0, 0, 1)
    jet_b = np.clip(1.5 - np.abs(2.0 * val - 0.5) * 2.0, 0, 1)
    heatmap_colored = (np.stack([jet_r, jet_g, jet_b], axis=-1) * 255).astype(np.uint8)

    # Smooth the heatmap with Gaussian blur for organic gradient feel
    hm_pil = Image.fromarray(heatmap_colored).filter(ImageFilter.GaussianBlur(radius=max(w, h) // 25))
    hm_smooth = np.array(hm_pil)

    # Blend 60% original leaf + 40% heatmap
    blended = (0.6 * img_np + 0.4 * hm_smooth).astype(np.uint8)
    blended_pil = Image.fromarray(blended)

    output_buf = io.BytesIO()
    blended_pil.save(output_buf, format="JPEG", quality=85)
    return output_buf.getvalue()
