from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

class LogEntry(BaseModel):
    start: datetime
    stop: datetime
    duration: str

logs: List[LogEntry] = []

@app.post("/logs", response_model=LogEntry)
async def create_log(log: LogEntry):
    logs.append(log)
    return log

@app.get("/logs", response_model=List[LogEntry])
async def get_logs():
    return logs