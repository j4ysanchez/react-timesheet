from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database

# Update the DATABASE_URL to use PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost/dbname"

database = Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

Base = declarative_base()

class LogEntryDB(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    start = Column(DateTime, nullable=False)
    stop = Column(DateTime, nullable=False)
    duration = Column(String, nullable=False)

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

class LogEntry(BaseModel):
    start: datetime
    stop: datetime
    duration: str

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/logs", response_model=LogEntry)
async def create_log(log: LogEntry):
    query = LogEntryDB.__table__.insert().values(
        start=log.start,
        stop=log.stop,
        duration=log.duration
    )
    await database.execute(query)
    return log

@app.get("/logs", response_model=List[LogEntry])
async def get_logs():
    query = LogEntryDB.__table__.select()
    results = await database.fetch_all(query)
    return results