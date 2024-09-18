import time
import json
from gql import gql, Client
from gql.transport.exceptions import TransportQueryError
from pydantic import BaseModel

class GitHubImporter():

    MAX_RETRIES = 10
    RETRY_WAIT_TIME = 3

    def __init__(self, cosmos_discussions_container, cosmos_issues_container, github_gql_client: Client, github_owner: str, github_repo: str):
        self.cosmos_discussions_container = cosmos_discussions_container
        self.cosmos_issues_container = cosmos_issues_container
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
        query($owner: String!, $name: String!, $categoryId: ID!, $after: String) {
            repository(owner: $owner, name: $name) {
                discussions(first: 100, categoryId: $categoryId, after: $after) {
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
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
        """)
        
        variables = {"owner": self.github_owner, "name": self.github_repo, "categoryId": self.github_discussions_category_id, "after": None}
        output = []
    
        while True:
            response = self.execute_gql_with_retry(query, variables)
            discussions = response["repository"]["discussions"]["nodes"]
            
            for discussion in discussions:
                record = {
                    "id": discussion["id"],
                    "title": discussion["title"],
                    "body": discussion["body"],
                    "comments": [comment["body"] for comment in discussion["comments"]["nodes"]]
                }
                output.append(record)
            
            page_info = response["repository"]["discussions"]["pageInfo"]
            if not page_info["hasNextPage"]:
                break
            
            variables["after"] = page_info["endCursor"]
        
        return output

    def import_issues(self):
        """
        Import issues from the GitHub repository to Cosmos DB
        """

        self.store_issues(self.fetch_issues())

    def store_issues(self, issues: dict):
        """
        Store issues in the Cosmos DB container
        """

        print("Storing issues...")
        for issue in issues:
            self.cosmos_issues_container.upsert_item(issue)

    def fetch_issues(self):
        """
        Fetch issues from the GitHub repository
        """
    
        print("Fetching issues...")
        query = gql("""
        query($owner: String!, $name: String!, $after: String) {
            repository(owner: $owner, name: $name) {
                issues(first: 100, after: $after) {
                    nodes {
                        id
                        title
                        body
                        labels(first: 100) {
                            nodes {
                                name
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
        """)
        
        variables = {"owner": self.github_owner, "name": self.github_repo, "after": None}
        output = []
    
        while True:
            response = self.execute_gql_with_retry(query, variables)
            issues = response["repository"]["issues"]["nodes"]
            
            for issue in issues:
                record = {
                    "id": issue["id"],
                    "title": issue["title"],
                    "body": issue["body"],
                    "label": issue["labels"]["nodes"][0]["name"] if issue["labels"]["nodes"] else None
                }
                output.append(record)
            
            page_info = response["repository"]["issues"]["pageInfo"]
            if not page_info["hasNextPage"]:
                break
            
            variables["after"] = page_info["endCursor"]
        
        return output
    
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
