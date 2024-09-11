from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from dotenv import load_dotenv
import os
from GitHubGenerator import GitHubGenerator
from openai import AzureOpenAI
import argparse

# Load environment variables from .env file
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_API_URL = "https://api.github.com/graphql"
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_VERSION = "2024-02-01"
AZURE_OPENAI_DEPLOYMENT_NAME = "gpt-4o"

# GitHub GraphQL client
headers = {"Authorization": f"bearer {GITHUB_TOKEN}"}
transport = RequestsHTTPTransport(url=GITHUB_API_URL, headers=headers)
github_gql_client = Client(transport=transport, fetch_schema_from_transport=True)

# OpenAI client
openai_client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-02-01",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

# Initialize GitHubGenerator
github_generator = GitHubGenerator(
    openai_client=openai_client,
    github_gql_client=github_gql_client,
    github_owner=GITHUB_OWNER,
    github_repo=GITHUB_REPO
)

# Define command functions
def generate_discussions():
    github_generator.generate_discussions()

def generate_all():
    print("Generating all items...")

def delete_all_discussions():
    github_generator.delete_all_discussions(GITHUB_OWNER, GITHUB_REPO)

def destroy_all():
    print("Destroying all items...")

# Parse command-line arguments
parser = argparse.ArgumentParser(description="GitHub Generator CLI")
subparsers = parser.add_subparsers(dest="command")

generate_parser = subparsers.add_parser("generate", help="Generate GitHub resources")
generate_subparsers = generate_parser.add_subparsers(dest="subcommand")
generate_subparsers.add_parser("all", help="Generate all items")
generate_subparsers.add_parser("discussions", help="Generate discussions")

destroy_parser = subparsers.add_parser("delete", help="Delete GitHub resources")
destroy_subparsers = destroy_parser.add_subparsers(dest="subcommand")
destroy_subparsers.add_parser("all", help="Destroy all items")
destroy_subparsers.add_parser("discussions", help="Destroy discussions")

# Parse arguments
args = parser.parse_args()

# Execute based on parsed arguments
if args.command == "generate":
    if args.subcommand == "all":
        generate_all()
    elif args.subcommand == "discussions":
        generate_discussions()
elif args.command == "delete":
    if args.subcommand == "all":
        destroy_all()
    elif args.subcommand == "discussions":
        delete_all_discussions()
else:
    parser.print_help()