from fastapi import FastAPI
from routes.sensors import router as sensor_router
from routes.realtime import router as realtime_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Define allowed origins
# Add CORS middleware BEFORE defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(sensor_router)
app.include_router(realtime_router)


@app.get("/")
async def root():
    return {"message": "Air Quality Monitoring System Backend is Running"}