from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from confluent_kafka import Producer
from enum import Enum
import json

# Kafka configuration
KAFKA_BROKER_URL = "localhost:9092"
KAFKA_TOPIC = "worker-logs"

# Create Kafka producer
producer = Producer({'bootstrap.servers': KAFKA_BROKER_URL})

app = FastAPI()

class LogType(str, Enum):
    work_start = "work_start"
    work_stop = "work_stop"

class LogEntry(BaseModel):
    timestamp: datetime
    worker_id: int
    logtype: LogType
    duration: str = None

def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result.
        Triggered by poll() or flush(). """
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

@app.post("/logs", response_model=LogEntry)
async def create_log(log: LogEntry):
    log_dict = log.dict()
    log_json = json.dumps(log_dict)
    producer.produce(KAFKA_TOPIC, log_json.encode('utf-8'), callback=delivery_report)
    producer.flush()
    return log

@app.get("/logs", response_model=List[LogEntry])
async def get_logs():
    raise HTTPException(status_code=501, detail="Not Implemented")