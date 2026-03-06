from pydantic import BaseModel

class IncidentCreate(BaseModel):
    description: str
    latitude: float
    longitude: float
    reported_by: int