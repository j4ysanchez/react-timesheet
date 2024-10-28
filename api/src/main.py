from fastapi import FastAPI
from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from confluent_kafka import Producer
from fastapi.encoders import jsonable_encoder

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

def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result.
        Triggered by poll() or flush(). """
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

@app.post("/logs", response_model=LogEntry)
async def create_log(log: LogEntry):
    log_data = jsonable_encoder(log)
    producer.produce(KAFKA_TOPIC, key=str(log.worker_id), value=str(log_data), callback=delivery_report)
    producer.flush()
    return log