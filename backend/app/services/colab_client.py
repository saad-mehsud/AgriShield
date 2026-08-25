import httpx
import logging
from app.config import settings

logger = logging.getLogger("agrishield.colab_client")

async def predict_with_colab(image_bytes: bytes) -> dict | None:
    """
    Sends the leaf image to the Google Colab GPU Inference Server (via ngrok/tunnel).
    Returns prediction dictionary if successful, or None to trigger local fallback.
    """
    colab_url = settings.COLAB_ML_URL.strip().rstrip("/")
    if not colab_url:
        return None

    target_url = f"{colab_url}/predict"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            files = {"file": ("leaf.jpg", image_bytes, "image/jpeg")}
            response = await client.post(target_url, files=files)
            if response.status_code == 200:
                logger.info("⚡ Successfully received prediction from Google Colab GPU Server!")
                return response.json()
            else:
                logger.warning(f"⚠️ Colab server returned status {response.status_code}: {response.text}")
                return None
    except Exception as e:
        logger.warning(f"⚠️ Could not reach Colab Server at {target_url} ({e}). Falling back to local ML engine.")
        return None
