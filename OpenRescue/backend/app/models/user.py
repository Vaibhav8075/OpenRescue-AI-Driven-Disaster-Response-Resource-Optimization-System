from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from sqlalchemy.ext.declarative import declarative_base
from app.database import Base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(20), default="citizen")
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))

