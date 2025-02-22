from fastapi import APIRouter, HTTPException
from models import SensorData
from datetime import datetime

router = APIRouter()

@router.get("/sensors")
async def get_sensors():
    return {"message": "Sensors endpoint"}

# @router.post("/sensor-data/")
# async def receive_sensor_data(data: SensorData):
#     """Receives sensor data and stores it in Firebase"""
    
#     try:
#         sensor_ref = db.collection("sensor_data").document()
#         sensor_ref.set(data.dict())
#         return {"message": "Data stored successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/sensor-data/")
# async def get_latest_sensor_data():
#     """Fetch latest sensor data from Firebase"""
#     try:
#         docs = db.collection("sensor_data").order_by("timestamp", direction="DESCENDING").limit(1).stream()
#         data = [doc.to_dict() for doc in docs]
#         return {"latest_data": data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))