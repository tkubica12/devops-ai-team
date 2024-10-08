from dotenv import load_dotenv
import os
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from gql.transport.exceptions import TransportQueryError
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
import time
from SharedClasses.GitHubTools import GitHubTools
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
COSMOS_CHECKPOINTS_CONTAINER_NAME = "checkpoints"
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
cosmos_checkpoints_container = cosmos_database.get_container_client(COSMOS_CHECKPOINTS_CONTAINER_NAME)

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
    api_version="2024-08-01-preview",
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

# Agent configuration
agent_config = AgentConfiguration(
    model=AZURE_OPENAI_DEPLOYMENT_NAME,
    embedding_model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    event_producer="agent_quality_control",
    instructions="""
**Quality Control prompt:**

You are an expert in code quality and best practices for React, JavaScript, and CSS.

You will receive a JSON list of files with their content. The JSON list is an array of objects, each with the attributes `name` and `content`. Your task is to review the code in these files and identify any quality issues or deviations from best practices. You should provide a concise, actionable report highlighting the problems and suggesting improvements. This report will be used by another agent to implement the necessary changes. On the other hand do not be overly critical or provide unnecessary details that could overwhelm the other agent.

Make sure that all components and CSS files have correct names and are properly referenced in code.

**Example:**

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
{
  "report": [
    {
      "file": "file1.js",
      "issues": [
        {
          "problem": "Use of console.log for debugging",
          "suggestion": "Replace with a proper logging mechanism or remove before production."
        }
      ]
    }
  ]
}
"""
)

# Initialize the agent
agent = Agent(openai_client=openai_client, agent_config=agent_config, cosmos_events_container=cosmos_events_container)

# Check for existing continuation token in checkpoints container
print("Checking for existing continuation token")
query = "SELECT * FROM c WHERE c.id = 'agent_quality_control'"
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
                if not github_tools.check_branch_exists(event.conversation_id):
                    print("Branch does not exist, skipping...")
                    agent.create_event(message="Branch with changes does not exist yet, agent_coder should first work on some code I can review.", next_agent="agent_facilitator", conversation_id=event.conversation_id)
                else:
                  # Get relevant application files from feature branch
                  files = github_tools.fetch_code_files(path=f"{event.conversation_id}:virtual-office-pet")

                  # Generate report based on files
                  message_output = agent.generate_report(instructions=agent.agent_config.instructions, files=files, conversation_id=event.conversation_id)

                  # Create event for the next agent
                  agent.create_event(message=message_output.model_dump_json(), next_agent="agent_facilitator", conversation_id=event.conversation_id)

        continuation_token = response.continuation_token

        # Save the continuation token to the checkpoints container
        checkpoint_document = {
            'id': 'agent_quality_control',
            'continuation_token': continuation_token
        }
        cosmos_checkpoints_container.upsert_item(checkpoint_document)
        
    # Wait before fetching the next discussions
    time.sleep(FETCH_INTERVAL)




