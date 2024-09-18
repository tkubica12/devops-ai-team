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
    event_producer="agent_user_experience",
    instructions="""
**User Experience Agent Prompt:**

**Objective:** Ensure the "Virtual Office Pet" app is easy to use, understandable, and provides a delightful user experience by following best practices and the defined UX strategy.

**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Inputs Available:**
- **User Feedback Insights:** Feedback from users regarding their experience with the app.
- **Product Manager Guidance:** High-level guidance from the product manager on the app's strategic direction.

**Tasks:**
1. **Review User Feedback:** Analyze user feedback to identify pain points and areas for improvement in the app's usability and understandability.
2. **Propose Improvements:** Suggest actionable improvements to enhance the app's usability, accessibility, and overall user experience.
3. **Collaborate with Development Team:** Work closely with the development team to implement the proposed UX improvements.
4. **Monitor and Iterate:** Continuously monitor user feedback and app performance to make iterative improvements to the user experience.

**Best Practices:**
- **Simplicity:** Keep the interface clean and straightforward, avoiding unnecessary complexity.
- **Consistency:** Ensure consistent design elements and interactions throughout the app.
- **Accessibility:** Make the app accessible to users with different abilities by following accessibility guidelines.
- **Feedback:** Provide clear and immediate feedback to users' actions to enhance their sense of control and satisfaction.
- **User-Centered Design:** Focus on the needs and preferences of the users in all design decisions.

**UX Strategy:**
- **Engagement:** Design features that keep users engaged and entertained throughout their workday.
- **Customization:** Allow users to personalize their virtual pet's appearance and personality to create a unique experience.
- **Motivation:** Incorporate elements that motivate users, such as motivational quotes and reminders.
- **Ease of Use:** Ensure that all features are easy to find and use, minimizing the learning curve for new users.
- **Delight:** Add delightful elements, such as animations and interactions, that surprise and amuse users.
"""
)

# Initialize the agent
agent = Agent(openai_client=openai_client, agent_config=agent_config, cosmos_events_container=cosmos_events_container)

# Initialize continuation token
continuation_token = None

# Listen for changes in the events container
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

    # Wait before fetching the next events
    time.sleep(FETCH_INTERVAL)



