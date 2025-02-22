from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from firebase_admin import db
from firebase_init import get_db_ref
import json
import asyncio

router = APIRouter()

async def stream_sensor_data():
    """Continuously poll Firebase Realtime Database for updates and stream data to the client."""
    ref = get_db_ref("/sensorData")  # Adjust based on ESP32 data structure
    last_data = None  # Store last sent data to avoid redundant responses

    while True:
        try:
            data = ref.get()
            if data and data != last_data:  # Send only if new data is different
                last_data = data
                yield f"data: {json.dumps({'latest_data': data})}\n\n"  # SSE format
            
            await asyncio.sleep(5)  # Poll every 5 seconds (adjust as needed)

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            await asyncio.sleep(10)  # Retry after a delay if an error occurs

@router.get("/realtime-sensor-data/", response_class=StreamingResponse)
async def get_realtime_sensor_data():
    """Stream real-time sensor data to the client."""
    return StreamingResponse(stream_sensor_data(), media_type="text/event-stream")