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
    api_version="2024-08-01-preview",
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

# Agent configuration
agent_config = AgentConfiguration(
    model=AZURE_OPENAI_DEPLOYMENT_NAME,
    embedding_model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    event_producer="agent_product_manager",
    rag_top_n=10,
    instructions="""
**Product Manager Agent Prompt:**

**Objective:** Focus on reviewing and prioritizing planned features, reported bugs, and backlog ideas from GitHub Issues to ensure alignment with the product strategy and current plans for the "Virtual Office Pet" app.

**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Inputs Available:**
- **GitHub Issues:** Planned features, reported bugs, and backlog ideas from GitHub Issues.
- **Additional Inputs:** Any other relevant data provided by other agents, such as User Feedback Insights and Market Analysis Reports, if they are available.

**Tasks:**
1. **Review Planned Features:** Examine the list of planned features to ensure they align with the product strategy and current development plans.
2. **Analyze Reported Bugs:** Prioritize reported bugs based on their impact on user experience and the overall functionality of the app.
3. **Evaluate Backlog Ideas:** Assess backlog ideas for their potential to enhance user engagement and improve the app.
4. **Prioritize Tasks:** Create a prioritized list of tasks that balances new feature development, bug fixes, and implementation of backlog ideas.
5. **Provide Recommendations:** Offer actionable recommendations for the development team to ensure that the selected tasks align with the product strategy and user needs.
6. **Collaborate with Other Agents:** Share insights and recommendations with other agents, such as the User Feedback Agent and Monetization Agent, to ensure a cohesive approach to app development and enhancement.

**Constraints:**
- **Focus on Product Strategy:** Ensure that all recommendations align with the overall product strategy and current development plans.
- **User-Centric Approach:** Prioritize tasks that enhance the user experience and address user needs effectively.
- **Balanced Prioritization:** Maintain a balance between new feature development, bug fixes, and backlog idea implementation.
""",

   intent_extraction_instructions="""
Sure, here's a prompt for extracting relevant information to search for issues such as planned features, backlog, or reported bugs from GitHub Discussions:

---

**Prompt:**

**Objective:** Extract a list of relevant topics discussed in the history of the conversation to facilitate vector search for issues such as planned features, backlog items, or reported bugs on GitHub.

**Inputs Available:**
- **Conversation History:** The entire history of the conversation, including all messages exchanged between the user and the agents.

**Tasks:**
1. **Analyze Conversation History:** Review the entire conversation history to understand the context and content of the discussion, with a focus on identifying decisions and topics that require user feedback.
2. **Identify Key Topics:** Extract key topics, themes, and subjects that have been discussed throughout the conversation, specifically those related to planned features, backlog items, or reported bugs.
3. **Generate Topic List:** Create a comprehensive list of the identified topics, ensuring that each topic is clearly defined and distinct.
4. **Format for Vector Search:** Ensure the list of topics is formatted in a way that is suitable for vector search, enabling efficient retrieval of relevant discussions on GitHub.

**Constraints:**
- **Focus on Relevance:** Only extract main topics that are relevant to the conversation and can aid in finding pertinent user discussions on GitHub.
- **Clarity and Precision:** Ensure that the extracted topics are clearly defined and accurately represent the content of the conversation.

**Example:**

**Conversation History:**
- User: "We need to add a feature where the virtual pet can send motivational quotes."
- Agent: "That's a great idea! We could also consider adding a feature where the pet can remind users to take breaks."
- User: "Yes, and maybe a bug report feature where users can report issues directly from the app."

**Extracted Topics:**
1. Feature: Virtual pet sending motivational quotes.
2. Feature: Virtual pet reminding users to take breaks.
3. Bug Report: In-app bug reporting feature.
"""
)

# Initialize the agent
agent = Agent(openai_client=openai_client, agent_config=agent_config, cosmos_events_container=cosmos_events_container, cosmos_rag_container=cosmos_rag_container)

# Check for existing continuation token in checkpoints container
print("Checking for existing continuation token")
query = "SELECT * FROM c WHERE c.id = 'agent_product_manager'"
items = list(cosmos_checkpoints_container.query_items(query=query, enable_cross_partition_query=True))

if items:
    continuation_token = items[0].get('continuation_token')
    print(f"Found continuation token: {continuation_token}")
else:
    continuation_token = None
    print("No continuation token found, starting from None")

# Listen for changes in the events container
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
                
                # Search for relevant GitHub Issues
                context = agent.search(input=intent)

                # Answer event using LLM
                agent.process(message_input=event.event_data.message, conversation_id=event.conversation_id, context=context)

        continuation_token = response.continuation_token

        # Save the continuation token to the checkpoints container
        checkpoint_document = {
            'id': 'agent_product_manager',
            'continuation_token': continuation_token
        }
        cosmos_checkpoints_container.upsert_item(checkpoint_document)
        
    # Wait before fetching the next events
    time.sleep(FETCH_INTERVAL)



