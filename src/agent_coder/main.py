from dotenv import load_dotenv
import os
from GitHubTools import GitHubTools
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from gql.transport.exceptions import TransportQueryError
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
import time
from SharedClasses.Agent import Agent, AgentConfiguration
from SharedClasses.Event import Event
from openai import AzureOpenAI

# Load environment variables from .env file
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_API_URL = "https://api.github.com/graphql"
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_DATABASE_NAME = os.getenv("COSMOS_DATABASE_NAME")
COSMOS_EVENTS_CONTAINER_NAME = "events"
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_VERSION = "2024-02-01"
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME")
FETCH_INTERVAL = 5

# GitHub GraphQL client
headers = {"Authorization": f"bearer {GITHUB_TOKEN}"}
transport = RequestsHTTPTransport(url=GITHUB_API_URL, headers=headers)
github_gql_client = Client(transport=transport, fetch_schema_from_transport=True)

# Cosmos DB client
credential = DefaultAzureCredential()
cosmos_client = CosmosClient(url=COSMOS_ENDPOINT, credential=credential)
cosmos_database = cosmos_client.get_database_client(COSMOS_DATABASE_NAME)
cosmos_events_container = cosmos_database.get_container_client(COSMOS_EVENTS_CONTAINER_NAME)

# Initialize GitHubTools
github_tools = GitHubTools(
    github_owner=GITHUB_OWNER,
    github_repo=GITHUB_REPO,
    github_gql_client=github_gql_client
)

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
    event_producer="agent_coder",
    instructions="""
**Coder prompt:**

You are skilled programmer in React, Javascript and CSS. 

You will receive a task description and a JSON list of files with their content. The JSON list is an array of objects, each with the attributes `name` and `content`. Your task is to implement the feature described in the task description by modifying the appropriate files from the JSON list. You may also create new files if necessary by adding them to the JSON list. Your output must be a pure JSON array of objects with the updated `name` and `content`.

**Example:**

Task: Log different message and add a new file

Input:
{
  "files": [
    {
      "name": "file1.js",
      "content": "console.log('Hello, world!');"
    }
  ]
}

Output:
[
  {
    "name": "file1.js",
    "content": "console.log('Hello, world changed!');"
  },
  {
    "name": "file2.js",
    "content": "function add(a, b) { return a + b; }"
  }
]
""",

   intent_extraction_instructions="""
**Extract Actionable Outcomes:**

**Objective:** Extract key actionable outcomes from the provided conversation history between the product manager, user experience team, and other agents. Focus on identifying specific tasks or features that have been agreed upon and provide technical descriptions for implementation.

**Instructions:**

1. **Extract Agreed Outcomes:** Identify the specific tasks, features, or improvements that have been agreed upon in the conversations.
2. **Provide Technical Descriptions:** Offer clear, technical descriptions of each actionable item to guide the coder in implementing the functionality.

**Example Output:**

1. Task: Implement 'Remember Me' feature
   Technical Description: Add a checkbox to the login form labeled 'Remember Me'. When checked, store the user's session token in a secure, persistent cookie with a long expiration time. Ensure the backend can recognize and validate this token on subsequent logins.

2. Task: Optimize backend authentication process
   Technical Description: Review and refactor the authentication logic to reduce processing time. Implement caching for frequently accessed authentication data. Ensure secure handling of user credentials and tokens.
"""
)

# Initialize the agent
agent = Agent(openai_client=openai_client, agent_config=agent_config, cosmos_events_container=cosmos_events_container)

# Initialize continuation token
continuation_token = None

latest_commit_oid = github_tools.create_branch("test")
github_tools.commit_files(branch="test", latest_commit_oid=latest_commit_oid, files=[{"name": "test.txt", "content": "Hello, world!"}])
import sys
sys.exit(0)


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

                # Get relevant application files
                files = github_tools.fetch_code_files()

                # Generate code based on the intent and files
                code = agent.generate_code(instructions=agent.agent_config.instructions, task_description=intent, files=files)

                print(code)

        continuation_token = response.continuation_token

    # Wait before fetching the next discussions
    time.sleep(FETCH_INTERVAL)




