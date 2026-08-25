from fastapi import APIRouter, Query
from app.schemas.schemas import WeatherAlertsResponse, WeatherAlertItem

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/alerts", response_model=WeatherAlertsResponse)
def get_weather_alerts(
    lat: float = Query(30.1575, description="Latitude (default Multan, Punjab)"),
    lng: float = Query(71.5249, description="Longitude (default Multan, Punjab)")
):
    # Standard regional seasonal risk simulation
    return WeatherAlertsResponse(
        location="Punjab & Sindh Agro-Zone",
        temperature_c=33.5,
        humidity_percent=82,
        overall_risk="ELEVATED (بیماری کا خطرہ زیادہ ہے)",
        alerts=[
          WeatherAlertItem(
              crop="Tomato / Potato",
              crop_urdu="ٹماٹر اور آلو",
              threat="Early & Late Blight",
              threat_urdu="اگیتا اور پچھیتا جھلسائو",
              risk_level="HIGH (شدید)",
              reason_urdu="زیادہ نمی (82%) پھپھوندی کے بیجوں کو تیزی سے اگنے میں مدد دیتی ہے۔ احتیاطی اسپرے کریں۔"
          ),
          WeatherAlertItem(
              crop="Cotton",
              crop_urdu="کپاس",
              threat="Whitefly Vector / CLCuV",
              threat_urdu="سفید مکھی اور پتا مڑاؤ وائرس",
              risk_level="HIGH (شدید)",
              reason_urdu="گرم مرطوب موسم میں سفید مکھی کی افزائش تیزی سے ہوتی ہے۔ پیلے کارڈز لگائیں۔"
          ),
          WeatherAlertItem(
              crop="Rice",
              crop_urdu="دھان / چاول",
              threat="Leaf Blast & Brown Spot",
              threat_urdu="دھان کا بلاسٹ اور بھورا دھبا",
              risk_level="MODERATE (درمیانہ)",
              reason_urdu="رات کے وقت شبنم اور گرم دنوں میں بلاسٹ کا حملہ ممکن ہے۔"
          )
        ]
    )
