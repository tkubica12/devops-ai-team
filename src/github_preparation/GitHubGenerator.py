import time
import json
from gql import gql, Client
from gql.transport.exceptions import TransportQueryError
from openai import AzureOpenAI
from pydantic import BaseModel

class Discussion(BaseModel):
    title: str
    body: str
    comments: list[str]

class Discussions(BaseModel):
    discussions: list[Discussion]

class Issue(BaseModel):
    title: str
    body: str

class Issues(BaseModel):
    issues: list[Issue]

class GitHubGenerator:
    prompt_product_description = """
    Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. 
    Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. 
    The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. 
    Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.
    """

    MAX_RETRIES = 10
    RETRY_WAIT_TIME = 3

    def __init__(self, openai_client: AzureOpenAI, github_gql_client: Client, github_owner: str, github_repo: str):
        self.openai_client = openai_client
        self.github_gql_client = github_gql_client
        self.github_owner = github_owner
        self.github_repo = github_repo
        self.github_repo_id = self.fetch_repository_id(github_owner, github_repo)
        self.github_discussions_category_id = self.fetch_discussions_general_category_id(github_owner, github_repo)
        self.fetch_issues_label_ids(github_owner, github_repo)

    def execute_gql_with_retry(self, query, variables):
        """
        Execute a GraphQL mutation with retry logic.
        """

        for attempt in range(self.MAX_RETRIES):
            try:
                response = self.github_gql_client.execute(query, variable_values=variables)
                return response
            except TransportQueryError as e:
                if "was submitted too quickly" in str(e):
                    if attempt < self.MAX_RETRIES - 1:
                        wait_time = self.RETRY_WAIT_TIME ** attempt
                        print(f"Error: {e}. Retrying in {wait_time} seconds...")
                        time.sleep(wait_time)
                    else:
                        print(f"Failed to execute after {self.MAX_RETRIES} attempts.")
                        raise
                else:
                    raise

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

            response = self.execute_gql_with_retry(discussion_mutation, discussion_mutation_variables)
            discussion_id = response["createDiscussion"]["discussion"]["id"]

            # Add comments to the discussion
            for comment in discussion["comments"]:
                comment_mutation_variables = {
                    "discussionId": discussion_id,
                    "body": comment
                }

                response = self.execute_gql_with_retry(comment_mutation, comment_mutation_variables)

    def delete_all_discussions(self):
        """
        Delete all discussions in the GitHub repository
        """
        
        query = gql("""
        query($owner: String!, $name: String!, $after: String) {
            repository(owner: $owner, name: $name) {
                discussions(first: 100, after: $after) {
                    nodes {
                        id
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
        
        while True:
            response = self.github_gql_client.execute(query, variable_values=variables)
            discussions = response["repository"]["discussions"]["nodes"]
            
            for discussion in discussions:
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
                self.execute_gql_with_retry(mutation, variables)
            
            page_info = response["repository"]["discussions"]["pageInfo"]
            if not page_info["hasNextPage"]:
                break
            
            variables["after"] = page_info["endCursor"]

    def delete_all_issues(self):
        """
        Delete all Issues in the GitHub repository
        """
        
        query = gql("""
        query($owner: String!, $name: String!, $after: String) {
            repository(owner: $owner, name: $name) {
                issues(first: 1, after: $after) {
                    nodes {
                        id
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
        
        while True:
            response = self.github_gql_client.execute(query, variable_values=variables)
            issues = response["repository"]["issues"]["nodes"]
            
            for issue in issues:
                issue_id = issue["id"]
                print(f"Deleting issue: {issue_id}")
                mutation = gql("""
                mutation($issueId: ID!) {
                    deleteIssue(input: {issueId: $issueId}) {
                        clientMutationId
                    }
                }
                """)
                variables_delete_issue = {"issueId": issue_id}
                self.execute_gql_with_retry(mutation, variables_delete_issue)
            
            page_info = response["repository"]["issues"]["pageInfo"]
            if not page_info["hasNextPage"]:
                break
            
            variables["after"] = page_info["endCursor"]

    def generate_issues(self):
        """
        Generate discussions for the GitHub repository
        """
        self.generate_issues_bug()
        self.generate_issues_feature()
        self.generate_issues_backlog()

    def generate_issues_bug(self):

        instructions = """
**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Task:**
Generate 50 GitHub issues in the bug category for the Virtual Office Pet app. Each issue should have a simple title and a detailed body that reflects a potential error in the application. The issues should be actionable and include the following sections: Description, Steps to Reproduce, Expected Behavior, Actual Behavior, and Environment.

**Examples:**

### Issue 1
**Title:** [Insert Bug Title Here]

**Body:**
**Description:**
[Insert a brief description of the bug here.]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]

**Expected Behavior:**
[Describe what should happen.]

**Actual Behavior:**
[Describe what actually happens.]

**Environment:**
- App Version: [Insert Version]
- OS: [Insert Operating System]

Use this structure to generate various bug reports for different potential issues in the Virtual Office Pet app. Make sure each issue is unique and clearly describes a specific problem that users might encounter.
        """

        response = self.openai_client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": instructions}
            ],
            response_format=Issues,
        )

        parsed_json = json.loads(response.choices[0].message.content)

        query = gql("""
            mutation($repositoryId: ID!, $title: String!, $body: String!, $labelId: ID!) {
                createIssue(input: {
                    repositoryId: $repositoryId,
                    title: $title,
                    body: $body,
                    labelIds: [$labelId]
                })
                {
                    issue {
                        id
                        title
                        body
                    }
                }
            }
        """)

        for issue in parsed_json["issues"]:
            print(f"Creating Bug Issue: {issue['title']}")

            variables = {
                "repositoryId": self.github_repo_id,
                "title": issue["title"],
                "body": issue["body"],
                "labelId": self.bug_label_id
            }
            response = self.execute_gql_with_retry(query, variables)

    def generate_issues_feature(self):
        instructions = """
**Prompt:**

Generate 15 GitHub issues for a new feature in the Virtual Office Pet app. The issue should include a simple title and a detailed body that describes a realistic and actionable feature. The feature should enhance user engagement and be relevant to the app's purpose of providing companionship and entertainment in the workplace. Ensure the issue includes acceptance criteria and any additional notes that might be helpful for the development team.

**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Example:**

**Title:** Add Daily Trivia Feature for Virtual Pet

**Body:**
**Description:**
Introduce a daily trivia feature where the virtual pet asks the user a fun trivia question each day. This feature aims to engage users and provide a brief, enjoyable break during their workday.

**Acceptance Criteria:**
1. The virtual pet should ask a new trivia question each day.
2. Users should be able to answer the trivia question and receive immediate feedback.
3. The trivia questions should cover a variety of topics and be appropriate for a workplace setting.
4. Users should have the option to skip the trivia question if they are busy.
5. The feature should be customizable, allowing users to set the time of day they receive the trivia question.

**Additional Notes:**
- Consider integrating a database of trivia questions that can be regularly updated.
- Ensure the trivia feature is accessible on both desktop and mobile versions of the app.
"""

        response = self.openai_client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": instructions}
            ],
            response_format=Issues,
        )

        parsed_json = json.loads(response.choices[0].message.content)

        query = gql("""
            mutation($repositoryId: ID!, $title: String!, $body: String!, $labelId: ID!) {
                createIssue(input: {
                    repositoryId: $repositoryId,
                    title: $title,
                    body: $body,
                    labelIds: [$labelId]
                })
                {
                    issue {
                        id
                        title
                        body
                    }
                }
            }
        """)

        for issue in parsed_json["issues"]:
            print(f"Creating Feature Issue: {issue['title']}")

            variables = {
                "repositoryId": self.github_repo_id,
                "title": issue["title"],
                "body": issue["body"],
                "labelId": self.feature_label_id
            }
            response = self.execute_gql_with_retry(query, variables)

    def generate_issues_backlog(self):
        instructions = """
**Prompt:**

Generate 50 GitHub backlog issues for the Virtual Office Pet app. The issue should include a simple title and a body that describes a potential new feature or improvement. The idea should be realistic and relevant to the app's purpose of providing companionship and entertainment in the workplace. The description can be less specific and structured, focusing more on the concept and potential benefits rather than detailed acceptance criteria.

**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Example:**

**Title:** Virtual Pet Mood Tracking

**Body:**
**Description:**
Consider adding a feature where the virtual pet's mood changes based on user interactions and activities. This could make the pet feel more lifelike and responsive to the user's behavior. For example, if the user frequently interacts with the pet, it could appear happier and more energetic. Conversely, if the pet is ignored, it might appear sad or bored.

**Potential Benefits:**
- Enhances user engagement by making the pet's behavior more dynamic and interactive.
- Provides users with a sense of companionship and responsibility towards their virtual pet.
- Adds an element of fun and surprise to the app, as users discover how different actions affect their pet's mood.

**Additional Notes:**
- This feature could be expanded with mood-specific actions or animations.
- Consider how mood changes could be visually represented in the pet's appearance or actions.
"""

        response = self.openai_client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": instructions}
            ],
            response_format=Issues,
        )

        parsed_json = json.loads(response.choices[0].message.content)

        query = gql("""
            mutation($repositoryId: ID!, $title: String!, $body: String!, $labelId: ID!) {
                createIssue(input: {
                    repositoryId: $repositoryId,
                    title: $title,
                    body: $body,
                    labelIds: [$labelId]
                })
                {
                    issue {
                        id
                        title
                        body
                    }
                }
            }
        """)

        for issue in parsed_json["issues"]:
            print(f"Creating Feature Issue: {issue['title']}")

            variables = {
                "repositoryId": self.github_repo_id,
                "title": issue["title"],
                "body": issue["body"],
                "labelId": self.backlog_label_id
            }
            response = self.execute_gql_with_retry(query, variables)

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
    
    def fetch_issues_label_ids(self, github_owner: str, github_repo: str):
        """
        Fetch the label IDs for issues
        """

        query = gql("""
        query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
                labels(first: 50) {
                    nodes {
                        id
                        name
                    }
                }
            }
        }
        """)
        variables = {"owner": github_owner, "name": github_repo}
        response = self.execute_gql_with_retry(query, variables)
        for label in response["repository"]["labels"]["nodes"]:
            if label["name"] == "feature":
                self.feature_label_id = label["id"]
                print(f"Feature label ID: {self.feature_label_id}")
            elif label["name"] == "bug":
                self.bug_label_id = label["id"]
                print(f"Bug label ID: {self.bug_label_id}")
            elif label["name"] == "backlog":
                self.backlog_label_id = label["id"]
                print(f"Backlog label ID: {self.backlog_label_id}")
        if not hasattr(self, 'feature_label_id') or not hasattr(self, 'bug_label_id') or not hasattr(self, 'backlog_label_id'):
            raise Exception("One or more required label IDs are missing, we expect backlog, bug and feature.")
    
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
        response = self.execute_gql_with_retry(query, variables)
        for category in response["repository"]["discussionCategories"]["nodes"]:
            if category["name"] == "General":
                return category["id"]
        return None