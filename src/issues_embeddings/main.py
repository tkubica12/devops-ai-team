from dotenv import load_dotenv
import os
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient, PartitionKey
from openai import AzureOpenAI
import time

# Load environment variables from .env file
load_dotenv()
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_DATABASE_NAME = os.getenv("COSMOS_DATABASE_NAME")
COSMOS_ISSUES_CONTAINER_NAME = "issues-embeddings"
COSMOS_ISSUES_RAW_CONTAINER_NAME = "issues"
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
cosmos_issues_raw_container = cosmos_database.get_container_client(COSMOS_ISSUES_RAW_CONTAINER_NAME)

cosmos_issues_container = cosmos_database.create_container_if_not_exists(
    id=COSMOS_ISSUES_CONTAINER_NAME,
    partition_key = PartitionKey(path="/id"),
    indexing_policy = { 
        "includedPaths": [ { "path": "/*" } ], 
        "excludedPaths": [ { "path": "/\"_etag\"/?" } ],
        "vectorIndexes": [ {"path": "/issues_embedding", "type": "diskANN" } ]
    },
    vector_embedding_policy = {
        "vectorEmbeddings": [
            {
                "path": "/issues_embedding",
                "dataType": "float32",
                "distanceFunction": "cosine",
                "dimensions": 3072
            }
        ]
    }
)
    
# OpenAI client
print("Connecting to Azure OpenAI")
openai_client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-02-01",
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

# Initialize continuation token
continuation_token = None

# Listen for changes in the issues container and process new issues
while True:
    response = cosmos_issues_raw_container.query_items_change_feed(is_start_from_beginning=False, continuation=continuation_token).by_page()
    print("Fetching new issues")
    for page in response:
        for doc in page:
            has_new_issues = True
            issues_title = doc["title"]
            issues_body = doc["body"]
            issues_label = doc["label"]
            issues_text = (
                f"Label: {issues_label}\n"
                f"Title: {issues_title}\n"
                f"Body: {issues_body}\n"
            ).strip()
            print(f"Processing issue: {issues_title}")
            issues_embedding = openai_client.embeddings.create(input=issues_text, model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME)

            # Create Cosmos DB document with the issues embedding
            newdoc = {
                "id": doc["id"],
                "text": issues_text,
                "issues_embedding": issues_embedding.data[0].embedding
            }
            cosmos_issues_container.upsert_item(newdoc)

        continuation_token = response.continuation_token

    # Wait before fetching the next issues
    time.sleep(FETCH_INTERVAL)



