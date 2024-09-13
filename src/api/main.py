from dotenv import load_dotenv
import os
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
import time
from Event import Event, AgentCommunicationData
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4

app = FastAPI()

# Load environment variables from .env file
load_dotenv()
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_DATABASE_NAME = os.getenv("COSMOS_DATABASE_NAME")
COSMOS_EVENTS_CONTAINER_NAME = "events"

# Cosmos DB client
print("Connecting to Cosmos DB")
credential = DefaultAzureCredential()
cosmos_client = CosmosClient(url=COSMOS_ENDPOINT, credential=credential)
cosmos_database = cosmos_client.get_database_client(COSMOS_DATABASE_NAME)
cosmos_events_container = cosmos_database.get_container_client(COSMOS_EVENTS_CONTAINER_NAME)

class UserMessage(BaseModel):
    message: str

@app.post("/api/user_message")
async def user_message(user_message: UserMessage):
    print(f"Message from user:\n{user_message.message}\n")
    try:
        event_data = AgentCommunicationData(
            message=user_message.message,
            next_agent="agent_facilitator"
        )
        event = Event(
            conversation_id=str(uuid4()),
            id=str(uuid4()),
            event_type="user_message",
            event_producer="user",
            event_data=event_data,
            timestamp=int(time.time())
        )
        cosmos_events_container.create_item(event.model_dump())
        print(f"Event created:\n{event.model_dump()}\n")
        return {"status": "success", "id": event.id, "conversation_id": event.conversation_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

