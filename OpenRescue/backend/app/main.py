from sqlalchemy.orm import session
from fastapi import FastAPI, WebSocket,Depends
from pydantic import BaseModel
from app.database import SessionLocal
from app.models.user import User
from sqlalchemy import select
from typing import List
import pickle
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

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
def get_users(db:session=Depends(get_db)):
    users=db.query(User).all()
    return users
