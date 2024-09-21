import time
import json
from gql import gql, Client
from gql.transport.exceptions import TransportQueryError
from pydantic import BaseModel

class File(BaseModel):
    name: str
    content: str

class Files(BaseModel):
    discussions: list[File]

class GitHubTools():

    MAX_RETRIES = 10
    RETRY_WAIT_TIME = 3

    def __init__(self, github_gql_client: Client, github_owner: str, github_repo: str):
        self.github_gql_client = github_gql_client
        self.github_owner = github_owner
        self.github_repo = github_repo
        # self.github_repo_id = self.fetch_repository_id(github_owner, github_repo)

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

    def fetch_code_files(self):
        """
        Fetch code files from the GitHub repository
        """

        src_files = self.get_app_files("main:virtual-office-pet/src")
        components_files = self.get_app_files("main:virtual-office-pet/src/components/ui")
        all_files = src_files + components_files
        return json.dumps(all_files)

    def get_app_files(self, path: str):
        """
        Get list of file in path
        """

        query = gql("""
        query($owner: String!, $name: String!, $path: String!) {
            repository(owner: $owner, name: $name) {
                object(expression: $path) {
                    ... on Tree {
                        entries {
                            name
                            type
                        }
                    }
                }
            }
        }
        """)

        variables = {"owner": self.github_owner, "name": self.github_repo, "path": path}
        response = self.execute_gql_with_retry(query, variables)
        files = []
        for file in response["repository"]["object"]["entries"]:
            if file["type"] == "blob" and (file["name"].endswith(".js") or file["name"].endswith(".js")):
                record = {
                    "name": f"{path}/{file["name"]}",
                    "content": self.get_file_content(f"{path}/{file["name"]}")
                }
                files.append(record)
        return files
    
    def get_file_content(self, path: str):
        """
        Get the content of a file
        """

        print(f"Fetching file content for {path}")

        query = gql("""
        query($owner: String!, $name: String!, $path: String!) {
            repository(owner: $owner, name: $name) {
                object(expression: $path) {
                    ... on Blob {
                        text
                    }
                }
            }
        }
        """)

        variables = {"owner": self.github_owner, "name": self.github_repo, "path": path}
        response = self.execute_gql_with_retry(query, variables)
        return response["repository"]["object"]["text"]

