from sqlalchemy.orm import Session
from fastapi import FastAPI, WebSocket,Depends
from pydantic import BaseModel
from app.schemas.incident_schema import IncidentCreate
from app.models.incident import Incident
from app.database import SessionLocal
from app.models.user import User
from sqlalchemy import select
from typing import List
import pickle
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

from app.models.incident import Incident
Base.metadata.create_all(bind=engine)
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
@app.get("/")
def root():
    return {"message": "OpenRescue Backend Running"}

@app.get('/users')
def get_users(db:Session=Depends(get_db)):
    users=db.query(User).all()
    return users
@app.post('/report')
def create_incident(incident:IncidentCreate,db:Session=Depends(get_db)):
     
    new_incident = Incident(
        description=incident.description,
        latitude=incident.latitude,
        longitude=incident.longitude,
        reported_by=incident.reported_by
    )
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return {"message":"incident report submitted successfully","incident":new_incident}

@app.get("/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).all()
    return incidents