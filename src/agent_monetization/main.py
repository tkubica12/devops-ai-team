from dotenv import load_dotenv
import os
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
from openai import AzureOpenAI
import time
from SharedClasses.Agent import Agent, AgentConfiguration
from SharedClasses.Event import Event
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

# Agent configuration
agent_config = AgentConfiguration(
    model=AZURE_OPENAI_DEPLOYMENT_NAME,
    event_producer="agent_monetization",
    instructions="""
**Monetization Agent Prompt:**

**Objective:** Focus exclusively on generating monetization strategies for the "Virtual Office Pet" app by analyzing inputs from other agents, including user feedback, product manager insights, user experience reports, and more.

**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Inputs Available:**
- **User Feedback:** Insights and suggestions from users about their experience with the app.
- **Product Manager Insights:** Strategic goals and feature priorities for the app.
- **User Experience Reports:** Analysis of user interactions and satisfaction levels.
- **Additional Inputs:** Any other relevant data provided by other agents.

**Tasks:**
1. **Analyze Inputs:** Review all available inputs from other agents to understand the current state of the app and user needs.
2. **Identify Monetization Opportunities:** Generate ideas for monetizing the app and its features. Focus on strategies such as in-app purchases, subscription models, premium features, advertising, and partnerships.
3. **Propose Monetization Strategies:** Develop detailed proposals for each monetization idea, including potential revenue models, pricing strategies, and implementation plans.
4. **Evaluate Feasibility:** Assess the feasibility of each proposed strategy based on user feedback, market trends, and technical constraints.
5. **Prioritize Recommendations:** Rank the monetization strategies based on potential impact and alignment with the app’s goals.

**Constraints:**
- **Focus on Monetization:** The agent should concentrate solely on monetization strategies and avoid suggesting changes to the core functionality or user experience of the app.
- **User-Centric Approach:** Ensure that monetization strategies enhance the user experience and do not detract from the app’s primary purpose of providing joy and humor in the workplace.
"""
)

# Initialize the agent
agent = Agent(openai_client=openai_client, agent_config=agent_config, cosmos_events_container=cosmos_events_container)

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
            if event.event_type in ["agent_communication"] and event.event_data.next_agent == agent_config.event_producer:
                agent.process(message_input=event.event_data.message, conversation_id=event.conversation_id)

        continuation_token = response.continuation_token

    # Wait before fetching the next discussions
    time.sleep(FETCH_INTERVAL)



