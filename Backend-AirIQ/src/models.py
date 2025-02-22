from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SensorData(BaseModel):
    timestamp: datetime
    co2: float
    nh3: float
    benzene: float
    temperature: float
    humidity: float
    pressure: float
    smoke: Optional[float] = None