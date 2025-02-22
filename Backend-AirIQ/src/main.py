from fastapi import FastAPI
from routes.sensors import router as sensor_router
from routes.realtime import router as realtime_router

app = FastAPI()

app.include_router(sensor_router)
app.include_router(realtime_router)

@app.get("/")
async def root():
    return {"message": "Air Quality Monitoring System Backend is Running"}