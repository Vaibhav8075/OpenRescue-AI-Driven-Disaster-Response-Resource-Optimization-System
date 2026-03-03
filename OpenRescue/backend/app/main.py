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
