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
COSMOS_CHECKPOINTS_CONTAINER_NAME = "checkpoints"
COSMOS_RAG_CONTAINER_NAME = os.getenv("COSMOS_RAG_CONTAINER_NAME")
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
cosmos_rag_container = cosmos_database.get_container_client(COSMOS_RAG_CONTAINER_NAME)
cosmos_checkpoints_container = cosmos_database.get_container_client(COSMOS_CHECKPOINTS_CONTAINER_NAME)

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
    embedding_model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    event_producer="agent_user_feedback",
    rag_top_n=3,
    instructions="""
**User Feedback Agent Prompt:**

**Objective:** Focus exclusively on gathering, analyzing, and synthesizing user feedback for the "Virtual Office Pet" app by leveraging relevant discussions from GitHub Discussions and other inputs provided by other agents.

**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Inputs Available:**
- **GitHub Discussions:** Relevant discussions from GitHub that provide insights into user experiences, issues, and suggestions.
- **Additional Inputs:** Any other relevant data provided by other agents, such as Product Manager Insights and User Experience Reports, if they are available.

**Tasks:**
1. **Gather User Feedback:** Collect user feedback from GitHub Discussions and other available sources to understand user experiences, issues, and suggestions.
2. **Analyze Feedback:** Review and analyze the collected feedback to identify common themes, pain points, and areas for improvement.
3. **Synthesize Insights:** Summarize the key insights from the feedback, highlighting the most critical user needs and suggestions.
4. **Provide Recommendations:** Offer actionable recommendations based on the analyzed feedback to improve the app’s user experience and functionality.
5. **Collaborate with Other Agents:** Share synthesized insights and recommendations with other agents, such as the Monetization Agent and Product Manager, to ensure a cohesive approach to app development and enhancement.

**Constraints:**
- **Focus on User Feedback:** The agent should concentrate solely on gathering and analyzing user feedback without suggesting changes to monetization strategies or other non-user-experience aspects of the app.
- **User-Centric Approach:** Ensure that all recommendations are aimed at enhancing the user experience and addressing user needs effectively.
""",

   intent_extraction_instructions="""
**Topic Extraction Task Prompt:**

**Objective:** Extract a list of topics discussed in the history of the conversation to facilitate vector search for relevant discussions on GitHub to get users feedback.

**Inputs Available:**
- **Conversation History:** The entire history of the conversation, including all messages exchanged between the user and the agents.

**Tasks:**
1. **Analyze Conversation History:** Review the entire conversation history to understand the context and content of the discussion with focus on decisions that require users feedback.
2. **Identify Key Topics:** Extract key topics, themes, and subjects that have been discussed throughout the conversation.
3. **Generate Topic List:** Create a comprehensive list of the identified topics, ensuring that each topic is clearly defined and distinct.
4. **Format for Vector Search:** Ensure the list of topics is formatted in a way that is suitable for vector search, enabling efficient retrieval of relevant discussions.

**Constraints:**
- **Focus on Relevance:** Only extract main topics that are relevant to the conversation and can aid in finding pertinent user discussions on GitHub.
- **Clarity and Precision:** Ensure that the extracted topics are clearly defined and accurately represent the content of the conversation.
"""
# **Inputs: most relevant discussions on GitHub discussions:**
)

# Initialize the agent
agent = Agent(openai_client=openai_client, agent_config=agent_config, cosmos_events_container=cosmos_events_container, cosmos_rag_container=cosmos_rag_container)

# Check for existing continuation token in checkpoints container
print("Checking for existing continuation token")
query = "SELECT * FROM c WHERE c.id = 'agent_user_feedback'"
items = list(cosmos_checkpoints_container.query_items(query=query, enable_cross_partition_query=True))

if items:
    continuation_token = items[0].get('continuation_token')
    print(f"Found continuation token: {continuation_token}")
else:
    continuation_token = None
    print("No continuation token found, starting from None")

# Listen for changes in the discussions container and process new discussions
while True:
    response = cosmos_events_container.query_items_change_feed(is_start_from_beginning=True, continuation=continuation_token).by_page()
    print("Looking for events...")
    for page in response:
        for doc in page:
            print(f"Processing event: {doc['id']}")
            event = Event(**doc)
            if event.event_type in ["agent_communication"] and event.event_data.next_agent == agent_config.event_producer:
                # Extract list of topics for search
                intent = agent.extract_intent(message_input=event.event_data.message, conversation_id=event.conversation_id)
                
                # Search for relevant GitHub discussions
                context = agent.search(input=intent)

                # Answer event using LLM
                agent.process(message_input=event.event_data.message, conversation_id=event.conversation_id, context=context)

        continuation_token = response.continuation_token

        # Save the continuation token to the checkpoints container
        checkpoint_document = {
            'id': 'agent_user_feedback',
            'continuation_token': continuation_token
        }
        cosmos_checkpoints_container.upsert_item(checkpoint_document)
        
    # Wait before fetching the next discussions
    time.sleep(FETCH_INTERVAL)



