from gql import gql, Client
from openai import AzureOpenAI
from pydantic import BaseModel
import json

class Discussion(BaseModel):
    title: str
    body: str
    comments: list[str]

class Discussions(BaseModel):
    discussions: list[Discussion]

class GitHubGenerator:
    prompt_product_description = """
    Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. 
    Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. 
    The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. 
    Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.
    """

    def __init__(self, openai_client: AzureOpenAI, github_gql_client: Client, github_owner: str, github_repo: str):
        self.openai_client = openai_client
        self.github_gql_client = github_gql_client
        self.github_owner = github_owner
        self.github_repo = github_repo
        self.github_repo_id = self.fetch_repository_id(github_owner, github_repo)
        self.github_discussions_category_id = self.fetch_discussions_general_category_id(github_owner, github_repo)

    def generate_discussions(self):
        """
        Generate discussions for the GitHub repository
        """

        instructions = """
        Generate at least 50 GitHub discussions for the Virtual Office Pet app. 
        The discussion should include a main discussion topic and an array of comments. 
        The main discussion should introduce a new feature idea for the app, comment on existing functionality or ask questions about what is possible and how to do it. 
        Each comment should provide feedback, suggestions, or questions about the feature.
        """

        prompt = f"""
        {instructions}

        Product Description:
        {self.prompt_product_description}
        """

        response = self.openai_client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt}
            ],
            response_format=Discussions,
        )

        parsed_json = json.loads(response.choices[0].message.content)

        # Create discussions in GitHub
        discussion_mutation = gql("""
        mutation($repositoryId: ID!, $title: String!, $body: String!, $categoryId: ID!) {
            createDiscussion(input: {repositoryId: $repositoryId, title: $title, body: $body, categoryId: $categoryId}) {
                discussion {
                    id
                    title
                    body
                }
            }
        }
        """)

        comment_mutation = gql("""
        mutation($discussionId: ID!, $body: String!) {
            addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
                comment {
                    id
                    body
                }
            }
        }
        """)

        for discussion in parsed_json["discussions"]:
            print(f"Creating discussion: {discussion['title']}")
            discussion_mutation_variables = {
                "repositoryId": self.github_repo_id,
                "title": discussion["title"],
                "body": discussion["body"],
                "categoryId": self.github_discussions_category_id
            }
            response = self.github_gql_client.execute(discussion_mutation, variable_values=discussion_mutation_variables)
            discussion_id = response["createDiscussion"]["discussion"]["id"]
            for comment in discussion["comments"]:
                comment_mutation_variables = {
                    "discussionId": discussion_id,
                    "body": comment
                }
                response = self.github_gql_client.execute(comment_mutation, variable_values=comment_mutation_variables)
        
    def delete_all_discussions(self, github_owner: str, github_repo: str):
        """
        Delete all discussions in the GitHub repository
        """
        
        query = gql("""
        query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
                discussions(first: 100) {
                    nodes {
                        id
                    }
                }
            }
        }
        """)
        variables = {"owner": github_owner, "name": github_repo}
        response = self.github_gql_client.execute(query, variable_values=variables)
        for discussion in response["repository"]["discussions"]["nodes"]:
            discussion_id = discussion["id"]
            print(f"Deleting discussion: {discussion_id}")
            mutation = gql("""
            mutation($discussionId: ID!) {
                deleteDiscussion(input: {id: $discussionId}) {
                    clientMutationId
                }
            }
            """)
            variables = {"discussionId": discussion_id}
            self.github_gql_client.execute(mutation, variable_values=variables)

    def generate_feature_requests(self):
        pass

    def generate_bugs(self):
        pass

    def generate_backlog(self):
        pass

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
        response = self.github_gql_client.execute(query, variable_values=variables)
        return response["repository"]["id"]
    
    def fetch_discussions_general_category_id(self, github_owner: str, github_repo: str):
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
        variables = {"owner": github_owner, "name": github_repo}
        response = self.github_gql_client.execute(query, variable_values=variables)
        for category in response["repository"]["discussionCategories"]["nodes"]:
            if category["name"] == "General":
                return category["id"]
        return None