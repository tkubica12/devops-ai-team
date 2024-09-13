import time
import json
from gql import gql, Client
from gql.transport.exceptions import TransportQueryError
from pydantic import BaseModel

class GitHubImporter():

    MAX_RETRIES = 10
    RETRY_WAIT_TIME = 3

    def __init__(self, cosmos_discussions_container, github_gql_client: Client, github_owner: str, github_repo: str):
        self.cosmos_discussions_container = cosmos_discussions_container
        self.github_gql_client = github_gql_client
        self.github_owner = github_owner
        self.github_repo = github_repo
        # self.github_repo_id = self.fetch_repository_id(github_owner, github_repo)
        self.github_discussions_category_id = self.fetch_discussions_general_category_id()

    def execute_gql_with_retry(self, query, variables):
        """
        Execute a GraphQL mutation with retry logic.
        """

        for attempt in range(self.MAX_RETRIES):
            try:
                response = self.github_gql_client.execute(
                    query, variable_values=variables)
                return response
            except TransportQueryError as e:
                if "was submitted too quickly" in str(e):
                    if attempt < self.MAX_RETRIES - 1:
                        wait_time = self.RETRY_WAIT_TIME ** attempt
                        print(
                            f"Error: {e}. Retrying in {wait_time} seconds...")
                        time.sleep(wait_time)
                    else:
                        print(
                            f"Failed to execute after {self.MAX_RETRIES} attempts.")
                        raise
                else:
                    raise

    def import_discussions(self):
        """
        Import discussions from the GitHub repository to Cosmos DB
        """

        self.store_discussions(self.fetch_discussions())

    def store_discussions(self, discussions: dict):
        """
        Store discussions in the Cosmos DB container
        """

        print("Storing discussions...")
        for discussion in discussions:
            self.cosmos_discussions_container.upsert_item(discussion)

    def fetch_discussions(self):
        """
        Fetch discussions from the GitHub repository
        """

        print("Fetching discussions...")
        query = gql("""
        query($owner: String!, $name: String!, $categoryId: ID!) {
            repository(owner: $owner, name: $name) {
                discussions(first: 100, categoryId: $categoryId) {
                    nodes {
                        id
                        title
                        body
                        comments(first: 100) {
                            nodes {
                                body
                            }
                        }
                    }
                }
            }
        }
        """)
        variables = {"owner": self.github_owner, "name": self.github_repo, "categoryId": self.github_discussions_category_id}
        response = self.execute_gql_with_retry(query, variables)
        return response["repository"]["discussions"]["nodes"]

    def fetch_discussions_general_category_id(self):
        """
        Fetch the category ID for general discussions
        """

        query = gql("""
        query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
                discussionCategories(first: 50) {
                    nodes {
                        id
                        name
                    }
                }
            }
        }
        """)
        variables = {"owner": self.github_owner, "name": self.github_repo}
        response = self.execute_gql_with_retry(query, variables)
        for category in response["repository"]["discussionCategories"]["nodes"]:
            if category["name"] == "General":
                return category["id"]
        return None
