from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import List
import pickle
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
allow_origins=["*"],


    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "ml" / "severity_model.pkl"
VECTORIZER_PATH = BASE_DIR / "ml" / "vectorizer.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(VECTORIZER_PATH, "rb") as f:
    vectorizer = pickle.load(f)

incidents = []
active_connections: List[WebSocket] = []

class Incident(BaseModel):
    description: str
    latitude: float
    longitude: float

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        active_connections.remove(websocket)

@app.get("/")
def home():
    return {"message": "OpenRescue Backend Running"}

@app.post("/report")
async def report_incident(incident: Incident):
    vectorized_text = vectorizer.transform([incident.description])
    severity = model.predict(vectorized_text)[0]

    incident_data = {
        "id": len(incidents) + 1,
        "description": incident.description,
        "lat": incident.latitude,
        "lon": incident.longitude,
        "severity": severity
    }

    incidents.append(incident_data)

    for connection in active_connections:
        await connection.send_json(incident_data)

    return incident_data

@app.get("/incidents")
def get_incidents():
    return incidents
