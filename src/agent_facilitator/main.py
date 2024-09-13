from dotenv import load_dotenv
import os
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
from openai import AzureOpenAI
import time
from Agent import Agent
from Event import Event, AgentCommunicationData
from uuid import uuid4

# Load environment variables from .env file
load_dotenv()
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_DATABASE_NAME = os.getenv("COSMOS_DATABASE_NAME")
COSMOS_EVENTS_CONTAINER_NAME = "events"
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_VERSION = "2024-02-01"
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME")
FETCH_INTERVAL = 5

# Cosmos DB client
print("Connecting to Cosmos DB")
credential = DefaultAzureCredential()
cosmos_client = CosmosClient(url=COSMOS_ENDPOINT, credential=credential)
cosmos_database = cosmos_client.get_database_client(COSMOS_DATABASE_NAME)
cosmos_events_container = cosmos_database.get_container_client(COSMOS_EVENTS_CONTAINER_NAME)

# OpenAI client
print("Connecting to Azure OpenAI")
openai_client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-05-01-preview",
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

agent = Agent(openai_client=openai_client, model=AZURE_OPENAI_DEPLOYMENT_NAME, cosmos_events_container=cosmos_events_container)

# Initialize continuation token
continuation_token = None

# Listen for changes in the discussions container and process new discussions
while True:
    response = cosmos_events_container.query_items_change_feed(is_start_from_beginning=False, continuation=continuation_token).by_page()
    print("Looking for events...")
    for page in response:
        for doc in page:
            print(f"Processing event: {doc['id']}")
            event = Event(**doc)
            if event.event_type == "user_message" and event.event_data.next_agent == "agent_facilitator":
                agent.process_user_message(message_input=event.event_data.message, conversation_id=event.conversation_id)
            if event.event_type == "agent_communication" and event.event_data.next_agent == "agent_facilitator":
                agent.process_agent_message(message_input=event.event_data.message, conversation_id=event.conversation_id)

        continuation_token = response.continuation_token

    # Wait before fetching the next discussions
    time.sleep(FETCH_INTERVAL)



