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

# Parse command-line arguments
parser = argparse.ArgumentParser(description="GitHub Generator CLI")
subparsers = parser.add_subparsers(dest="command")

generate_parser = subparsers.add_parser("generate", help="Generate GitHub resources")
generate_subparsers = generate_parser.add_subparsers(dest="subcommand")
generate_subparsers.add_parser("all", help="Generate all items")
generate_subparsers.add_parser("discussions", help="Generate discussions")
generate_subparsers.add_parser("issues", help="Generate issues")

destroy_parser = subparsers.add_parser("delete", help="Delete GitHub resources")
destroy_subparsers = destroy_parser.add_subparsers(dest="subcommand")
destroy_subparsers.add_parser("all", help="Destroy all items")
destroy_subparsers.add_parser("discussions", help="Destroy issues")
destroy_subparsers.add_parser("issues", help="Destroy discussions")

# Parse arguments
args = parser.parse_args()

# Get instance of GitHub Generator
gh = GitHubGenerator(openai_client, github_gql_client, GITHUB_OWNER, GITHUB_REPO)

# Execute based on parsed arguments
if args.command == "generate":
    if args.subcommand == "all":
        gh.generate_discussions()
    elif args.subcommand == "discussions":
        gh.generate_discussions()
    elif args.subcommand == "issues":
        gh.generate_issues()
elif args.command == "delete":
    if args.subcommand == "all":
        gh.delete_all_discussions()
    elif args.subcommand == "discussions":
        gh.delete_all_discussions()
    elif args.subcommand == "issues":
        gh.delete_all_issues()
else:
    parser.print_help()