from dotenv import load_dotenv
import os
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient
from openai import AzureOpenAI
import time

# Load environment variables from .env file
load_dotenv()
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_DATABASE_NAME = os.getenv("COSMOS_DATABASE_NAME")
COSMOS_DISCUSSIONS_CONTAINER_NAME = "discussions-embeddings"
COSMOS_DISCUSSIONS_RAW_CONTAINER_NAME = "discussions"
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_VERSION = "2024-02-01"
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME")
FETCH_INTERVAL = 15

# Cosmos DB client
print("Connecting to Cosmos DB")
credential = DefaultAzureCredential()
cosmos_client = CosmosClient(url=COSMOS_ENDPOINT, credential=credential)
cosmos_database = cosmos_client.get_database_client(COSMOS_DATABASE_NAME)
cosmos_discussions_raw_container = cosmos_database.get_container_client(COSMOS_DISCUSSIONS_RAW_CONTAINER_NAME)
cosmos_discussions_container = cosmos_database.get_container_client(COSMOS_DISCUSSIONS_CONTAINER_NAME)

# OpenAI client
print("Connecting to Azure OpenAI")
openai_client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-02-01",
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

# Initialize continuation token
continuation_token = None

# Listen for changes in the discussions container and process new discussions
while True:
    response = cosmos_discussions_raw_container.query_items_change_feed(is_start_from_beginning=False, continuation=continuation_token).by_page()
    print("Fetching new discussions")
    # has_new_discussions = False
    for page in response:
        for doc in page:
            has_new_discussions = True
            discussion_title = doc["title"]
            discussion_body = doc["body"]
            discussion_comments_markdown = "\n".join(
                [f"- {comment['body']}" for comment in doc["comments"]["nodes"]])
            discussion_text = (
                f"Title: {discussion_title}\n"
                f"Body: {discussion_body}\n"
                f"Comments:\n"
                f"{discussion_comments_markdown}"
            ).strip()
            print(f"Processing discussion: {discussion_title}")
            discussion_embedding = openai_client.embeddings.create(input=discussion_text, model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME)

            # Create Cosmos DB document with the discussion embedding
            newdoc = {
                "id": doc["id"],
                "text": discussion_text,
                "discussion_embedding": discussion_embedding.data[0].embedding
            }
            cosmos_discussions_container.upsert_item(newdoc)

        continuation_token = response.continuation_token

    # Wait before fetching the next discussions
    time.sleep(FETCH_INTERVAL)



