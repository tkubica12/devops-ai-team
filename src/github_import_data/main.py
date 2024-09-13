from dotenv import load_dotenv
import os
from GitHubImporter import GitHubImporter
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient

# Load environment variables from .env file
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_API_URL = "https://api.github.com/graphql"
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_DATABASE_NAME = os.getenv("COSMOS_DATABASE_NAME")
COSMOS_DISCUSSIONS_CONTAINER_NAME = "discussions"

# GitHub GraphQL client
headers = {"Authorization": f"bearer {GITHUB_TOKEN}"}
transport = RequestsHTTPTransport(url=GITHUB_API_URL, headers=headers)
github_gql_client = Client(transport=transport, fetch_schema_from_transport=True)

# Cosmos DB client
credential = DefaultAzureCredential()
cosmos_client = CosmosClient(url=COSMOS_ENDPOINT, credential=credential)
cosmos_database = cosmos_client.get_database_client(COSMOS_DATABASE_NAME)
cosmos_discussions_container = cosmos_database.get_container_client(COSMOS_DISCUSSIONS_CONTAINER_NAME)

# Initialize GitHubImporter
github_importer = GitHubImporter(
    github_owner=GITHUB_OWNER,
    github_repo=GITHUB_REPO,
    github_gql_client=github_gql_client,
    cosmos_discussions_container=cosmos_discussions_container
)

github_importer.import_discussions()