import time
import json
from gql import gql, Client
from gql.transport.exceptions import TransportQueryError
from pydantic import BaseModel
import base64

class File(BaseModel):
    name: str
    content: str

class Files(BaseModel):
    files: list[File]

class GitHubTools():

    MAX_RETRIES = 10
    RETRY_WAIT_TIME = 3

    def __init__(self, github_gql_client: Client, github_owner: str, github_repo: str):
        self.github_gql_client = github_gql_client
        self.github_owner = github_owner
        self.github_repo = github_repo
        self.github_repo_id = self.fetch_repository_id(github_owner, github_repo)

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
        all_files = Files(files=src_files.files + components_files.files)
        return all_files

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
        files = Files(files=[])
        for file in response["repository"]["object"]["entries"]:
            if file["type"] == "blob" and (file["name"].endswith(".js") or file["name"].endswith(".js")):
                record = File(
                    name = f"{path}/{file["name"]}",
                    content = self.get_file_content(f"{path}/{file["name"]}")
                )
                files.files.append(record)
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

    def fetch_repository_id(self, github_owner: str, github_repo: str):
        """
        Fetch the repository ID using the GitHub GraphQL API
        """

        query = gql("""
        query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
                id
            }
        }
        """)
        variables = {"owner": github_owner, "name": github_repo}
        response = self.execute_gql_with_retry(query, variables)
        return response["repository"]["id"]
    
    def create_branch(self, branch_name: str):
        """
        Create a new branch in the GitHub repository based on latest commit in main
        """

        # Get the latest commit on the main branch
        query = gql("""
        query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
                ref(qualifiedName: "main") {
                    target {
                        ... on Commit {
                            oid
                        }
                    }
                }
            }
        }
        """)
        variables = {"owner": self.github_owner, "name": self.github_repo}
        response = self.execute_gql_with_retry(query, variables)
        print(response)
        latest_commit_oid = response["repository"]["ref"]["target"]["oid"]
        print(f"Latest commit OID: {latest_commit_oid}")

        query = gql("""
        mutation($repositoryId: ID!, $branchName: String!, $oid: GitObjectID!) {
            createRef(input: {repositoryId: $repositoryId, name: $branchName, oid: $oid}) {
                ref {
                    name
                }
            }
        }
        """)
        variables = {"repositoryId": self.github_repo_id, "branchName": f"refs/heads/{branch_name}", "oid": latest_commit_oid}
        response = self.execute_gql_with_retry(query, variables)
        print(f"Branch created: {response}")

        return latest_commit_oid
    
    def commit_files(self, latest_commit_oid: str, branch: str, files: Files):
        """
        Commit the files to the GitHub repository
        """

        files = Files(files=[])
        for file in files:
            record = File(
                name = "file.txt",
                content = "Nazdar vole"
            )
            files.files.append(record)

        additions = []
        for file in files.files:
            encoded_content = base64.b64encode(file.content.encode()).decode()
            additions.append({
                "path": file.name,
                "contents": encoded_content
            })

        print(f"Committing files: {additions}")

        query = gql("""
            mutation($name_with_owner: String!, $branch: String!, $latest_commit_oid: GitObjectID!, $additions: [FileAddition!]!) {
            createCommitOnBranch(input: {
                branch: {
                    repositoryNameWithOwner: $name_with_owner,
                    branchName: $branch
                },
                expectedHeadOid: $latest_commit_oid,
                message: {
                    headline: "agent_coder added files",
                },
                fileChanges: {
                    additions: $additions,
                    deletions: [] 
                }
            }) {
                commit {
                oid
                url
                }
            }
            }
            """)
        variables = {
            "name_with_owner": f"{self.github_owner}/{self.github_repo}", 
            "branch": branch, 
            "latest_commit_oid": latest_commit_oid,
            "additions": additions
            }

        response = self.execute_gql_with_retry(query, variables)
        print(f"Files committed: {response}")

