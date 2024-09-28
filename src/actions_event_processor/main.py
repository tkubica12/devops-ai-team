from dotenv import load_dotenv
import os
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
import time
from Event import Event, AgentCommunicationData
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class ActionsEvent(BaseModel):
    conversation_id: str
    log: str

@app.post("/api/actions_event")
async def actions_event(actions_event: ActionsEvent):
    print(f"Log from GitHub Actions:\n{actions_event.log}\n")
    try:
        event_data = AgentCommunicationData(
            message=f"# Error when building application\n\nCheck the logs for more information and fix issues in code.\n\n{actions_event.log}",
            next_agent="agent_coder"
        )
        event = Event(
            conversation_id=actions_event.conversation_id,
            id=str(uuid4()),
            event_type="agent_communication",
            event_producer="github_actions",
            event_data=event_data,
            timestamp=int(time.time())
        )
        cosmos_events_container.create_item(event.model_dump())
        print(f"Event created:\n{event.model_dump()}\n")
        return {"status": "success", "id": event.id, "conversation_id": event.conversation_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
