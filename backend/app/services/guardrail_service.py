import io
import numpy as np
from PIL import Image

def validate_leaf_image(image_bytes: bytes) -> tuple[bool, str, dict]:
    """
    Validates if an uploaded image contains a legitimate plant leaf/crop structure
    using biological color spectrum analysis, texture variance, and aspect properties.

    Returns:
        is_valid (bool): True if valid plant/leaf, False otherwise.
        reason_code (str): Machine code for the result.
        messages (dict): Multilingual user feedback messages.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return False, "CORRUPT_IMAGE", {
            "en": "The uploaded file is corrupted or not a valid image.",
            "ur": "اپ لوڈ کی گئی فائل درست تصویر نہیں ہے یا خراب ہے۔",
            "ps": "اپلوډ شوی فایل سم انځور نه دی.",
            "sd": "اپلوڊ ڪيل فائل درست فوٽو ناهي."
        }

    width, height = image.size
    if width < 50 or height < 50:
        return False, "IMAGE_TOO_SMALL", {
            "en": "Image resolution is too low. Please upload a clearer photo.",
            "ur": "تصویر کا سائز بہت چھوٹا ہے۔ براہ کرم واضح تصویر لیں۔",
            "ps": "د انځور کیفیت ډیر ټیټ دی. مهرباني وکړئ روښانه انځور واخلئ.",
            "sd": "فوٽو جو سائيز تمام ننڍو آهي. مھرباني ڪري صاف فوٽو ڪڍو."
        }

    # Resize for fast mathematical evaluation
    thumb = image.resize((128, 128))
    img_np = np.array(thumb, dtype=np.float32)

    # 1. Check Variance (Detect blank, solid, or flat non-organic images)
    std_dev = np.std(img_np)
    if std_dev < 12.0:
        return False, "BLANK_OR_FLAT_IMAGE", {
            "en": "No details detected in photo. Please focus on a crop leaf.",
            "ur": "تصویر میں کوئی تفصیل نظر نہیں آ رہی۔ براہ کرم پتے پر فوکس کریں۔",
            "ps": "په انځور کې هیڅ شی نه ښکاري. مهرباني وکړئ پر پاڼه تمرکز وکړئ.",
            "sd": "فوٽو ۾ ڪا به تفصيل نظر نٿي اچي. مھرباني ڪري پن تي فوڪس ڪريو."
        }

    # 2. Biological Leaf Color Distribution (RGB to HSV conversion)
    r = img_np[:, :, 0] / 255.0
    g = img_np[:, :, 1] / 255.0
    b = img_np[:, :, 2] / 255.0

    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    delta = cmax - cmin

    # Calculate Hue (0 - 360 degrees)
    hue = np.zeros_like(r)
    mask = delta > 0.001
    
    # Red is max
    r_mask = mask & (cmax == r)
    hue[r_mask] = (60.0 * ((g[r_mask] - b[r_mask]) / delta[r_mask])) % 360.0
    
    # Green is max
    g_mask = mask & (cmax == g)
    hue[g_mask] = (60.0 * ((b[g_mask] - r[g_mask]) / delta[g_mask]) + 120.0) % 360.0
    
    # Blue is max
    b_mask = mask & (cmax == b)
    hue[b_mask] = (60.0 * ((r[b_mask] - g[b_mask]) / delta[b_mask]) + 240.0) % 360.0

    # Calculate Saturation & Value
    sat = np.zeros_like(cmax)
    sat[cmax > 0] = delta[cmax > 0] / cmax[cmax > 0]
    val = cmax

    # Biological vegetation filters:
    # 1. Healthy Foliage Green / Emerald: Hue 35° to 160°, Saturation >= 0.12, Value >= 0.15
    green_mask = (hue >= 35.0) & (hue <= 160.0) & (sat >= 0.12) & (val >= 0.15)
    
    # 2. Chlorotic Yellow / Wilt: Hue 20° to 45°, Saturation >= 0.18, Value >= 0.20
    yellow_mask = (hue >= 20.0) & (hue <= 45.0) & (sat >= 0.18) & (val >= 0.20)
    
    # 3. Necrotic Blight / Rust / Brown Lesions: Hue 8° to 30°, Saturation >= 0.18, Value >= 0.15
    brown_mask = (hue >= 8.0) & (hue <= 30.0) & (sat >= 0.18) & (val >= 0.15)

    # Combined plant matter mask
    plant_pixels = green_mask | yellow_mask | brown_mask
    plant_ratio = np.count_nonzero(plant_pixels) / (128.0 * 128.0)

    # If plant pixel ratio is below 12%, reject as non-plant/OOD
    if plant_ratio < 0.12:
        return False, "NON_PLANT_IMAGE", {
            "en": "No plant leaf detected. Please take a clear, close-up photo of a crop leaf.",
            "ur": "پودے یا پتے کی شناخت نہیں ہو سکی۔ براہ کرم پتے کی واضح اور قریبی تصویر اپ لوڈ کریں۔",
            "ps": "د نبات پاڼه ونه موندل شوه. مهرباني وکړئ د پاڼې روښانه او نږدې انځور واخلئ.",
            "sd": "ٻوٽي يا پن جي سڃاڻپ نه ٿي سگھي. مھرباني ڪري پن جو صاف ۽ ويجھو فوٽو اپلوڊ ڪريو."
        }

    return True, "VALID_LEAF", {
        "en": "Valid leaf image",
        "ur": "درست پتے کی تصویر",
        "ps": "سمه پاڼه",
        "sd": "درست پن"
    }
