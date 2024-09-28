from dotenv import load_dotenv
import os
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
import time
from Event import Event, AgentCommunicationData
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from uuid import uuid4
from typing import List, Dict

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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class UserMessage(BaseModel):
    message: str
    conversation_id: str

@app.post("/api/user_message")
async def user_message(user_message: UserMessage):
    print(f"Message from user:\n{user_message.message}\n")
    try:
        event_data = AgentCommunicationData(
            message=user_message.message,
            next_agent="agent_facilitator"
        )
        event = Event(
            conversation_id=user_message.conversation_id,
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

@app.get("/api/messages", response_model=List[Dict[str, str]])
async def get_messages(conversation_id: str = Query(..., description="The ID of the conversation")):
    try:
        # Query the container for events with the specified conversation_id
        query = f"SELECT c.event_data.message, c.event_data.next_agent, c.event_producer, c.timestamp FROM c WHERE c.conversation_id = @conversation_id ORDER BY c.timestamp"
        parameters = [{"name": "@conversation_id", "value": conversation_id}]
        items = cosmos_events_container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True)
        response = []
        for item in items:
            response.append({"message": item["message"], "timestamp": str(item["timestamp"]), "event_producer": item["event_producer"], "next_agent": item["next_agent"]})
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/conversations", response_model=List[str])
async def get_conversations():
    try:
        # Query the container for all unique conversation IDs
        query = "SELECT DISTINCT c.conversation_id FROM c ORDER BY c.timestamp DESC"
        items = cosmos_events_container.query_items(query=query, enable_cross_partition_query=True)
        response = []
        for item in items:
            response.append(item["conversation_id"])
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

app.mount("/", StaticFiles(directory="./ui", html=True), name="ui")