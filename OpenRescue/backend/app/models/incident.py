from sqlalchemy import Column, Integer, String, DateTime  ,TIMESTAMP,text  
from sqlalchemy.ext.declarative import declarative_base
Base=declarative_base()
class Incident(Base):
    __tablename__="incidents"
    id=Column(Integer,primary_key=True,index=True)
    description=Column(String,nullable=False)
    latitude=Column(Integer,nullable=False)
    longitude=Column(Integer,nullable=False)
    severity=Column(String(20),default="low")
    reported_by=Column(Integer)
    created_at=Column(TIMESTAMP,server_default=text('CURRENT_TIMESTAMP'))
