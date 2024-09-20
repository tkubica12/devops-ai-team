from openai import AzureOpenAI
import time
import json
from Event import Event, AgentCommunicationData
from uuid import uuid4

class Facilitator:
    instructions = """
# Facilitator agent

**Objective:** The facilitator's role is to receive input and the history of conversations from either the user or other agents. Based on this information, the facilitator will acknowledge the input and determine which agent should contribute next to add the most value to the conversation.

**Instructions:**

1. **Receiving Input:**
   - If the input is from the user:
     - Provide a brief acknowledgment (e.g., "Got it, working on that now.").
     - Analyze the history of the conversation to understand the context and the user's needs.
   - If the input is from another agent:
     - Review the provided information and the history of the conversation.

2. **Analyzing History:**
   - Examine the conversation history to identify key points, recurring themes, and any unresolved issues.
   - Determine the current focus of the conversation and what information or action is needed next.

3. **Deciding the Next Agent:**
   - Based on the analysis, decide which agent can best contribute to the conversation at this point. Consider the following agents and their roles:
     - **agent_user_feedback:** Provides insights from user discussions on GitHub, including feature requests, sentiment analysis, and suggestions.
     - **agent_product_manager:** Maintains the roadmap of features and fixes, and oversees overall product strategy.
     - **agent_user_experience:** Ensures the application is user-friendly and understandable.
     - **agent_monetization:** Explores ways to monetize the product while ensuring it remains valuable and profitable.
     - **agent_writer:** Creates content for the product, including documentation, blog posts, and marketing materials after code is finished.
     - **agent_coder:** Implements new features and fixes bugs in the product.
     - **agent_security:** Ensures the product is secure and compliant with relevant regulations.
     - **agent_devops:** Manages the deployment and operation of the product.
     - **agent_quality_control:** Ensures the code meets quality standards and is free of defects.
     - **done:** Indicates the end of the conversation.
     - Make sure all agents are utilized effectively and that the conversation progresses in a meaningful way. Try to balance the contributions of different agents to address various aspects of the product.
     - Conversions should not go in circles, and each agent should add value to the conversation. Typical conversation flow:
        1. Discussion about what to build (agent_user_feedback, agent_product_manager, agent_user_experience, agent_monetization).
        2. Writing, testing and deploying code (agent_coder, agent_security, agent_devops, agent_quality_control).
        3. Writing documentation and marketing materials (agent_writer) after the code is finished.
        4. End of conversation (done).

4. **Facilitating the Next Step:**
   - Direct the chosen agent to contribute to the conversation.
   - Provide the agent with relevant context and any specific questions or tasks they need to address.

**List of Agents:**

1. **agent_user_feedback**
   - Role: Overlooks user discussions on GitHub and provides information about what features people are talking about, sentiment, suggestions, etc.

2. **agent_product_manager**
   - Role: Maintains the roadmap of features and bugs, and oversees overall product strategy.

3. **agent_user_experience**
   - Role: Ensures the application is easy to use and understandable.

4. **agent_monetization**
   - Role: Looks into ways to monetize the product and make it valuable yet profitable.

5. **agent_writer**
    - Role: Creates content for the product, including documentation, blog posts, and marketing materials after code is finished.

6. **agent_coder**
    - Role: Implements new features and fixes bugs in the product.

7. **agent_security**
    - Role: Ensures the product is secure and compliant with relevant regulations.

8. **agent_devops**
    - Role: Manages the deployment and operation of the product.

9. **agent_quality_control**
    - Role: Ensures the code meets quality standards and is free of defects.

**Example Workflow:**

- **User Input:** "What are users saying about the new feature on GitHub?"
  - **Facilitator Response:** "Got it, working on that now."
  - **Action:** Analyze the conversation history to understand the context.
  - **Decision:** Direct the **user_feedback_agent** to provide insights on user discussions about the new feature.

- **Agent Input:** "The product manager has updated the roadmap with new features."
  - **Facilitator Action:** Review the updated roadmap and conversation history.
  - **Decision:** If the conversation is about user experience, direct the **user_experience_agent** to ensure the new features are user-friendly.
"""

    def __init__(self, openai_client: AzureOpenAI, model: str, cosmos_events_container):
        self.openai_client = openai_client
        self.model = model
        self.cosmos_events_container = cosmos_events_container

    def process_user_message(self, message_input: str, conversation_id: str):
        print(f"Message from user:\n{message_input}\n")

        # Generate a response to the user if needed
        message_to_user = self.call_model(message_input)
        self.create_event(
            message=message_to_user, 
            next_agent="user", 
            conversation_id=conversation_id
            )
        
        combined_message = f"User: {message_input}\nAssistant: {message_to_user}"
        self.process_agent_message(message_input=combined_message, conversation_id=conversation_id)
        
    def process_agent_message(self, message_input: str, conversation_id: str):
        
        # Facilitate the conversation with the next agent
        next_agent, message_to_agent = self.extract_arguments_for_next_agent(message_input=message_input, history=self.build_history(conversation_id=conversation_id))
        self.create_event(
            message=message_to_agent, 
            next_agent=next_agent, 
            conversation_id=conversation_id
            )

    def create_event(self, message: str, next_agent: str, conversation_id: str):
        event_data = AgentCommunicationData(
            message=message,
            next_agent=next_agent
        )
        event = Event(
            event_type="agent_communication",
            conversation_id=conversation_id,
            id=str(uuid4()),
            event_producer="agent_facilitator",
            event_data=event_data,
            timestamp=int(time.time())
        )
        # Send the event to Cosmos DB
        self.cosmos_events_container.create_item(event.model_dump())
    
    def call_model(self, message: str):
        # Prepare the messages for the model
        messages = []
        messages.append({"role": "system", "content": self.instructions})
        messages.append({"role": "user", "content": message})

        # Send the messages to the model
        response = self.openai_client.chat.completions.create(
            messages=messages, 
            model=self.model
            )
        
        # Extract the response from the model
        message_to_user = response.choices[0].message.content
        print(f"Message to user:\n{message_to_user}\n")
        return message_to_user

    def extract_arguments_for_next_agent(self, message_input: str, history: str = None):
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "pass_message_to_agent",
                    "description": "Passes the message to the specified agent for further processing.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "agent": {
                                "type": "string",
                                "description": "Name of the agent to which the message should be passed.",
                            },
                            "message": {
                                "type": "string",
                                "description": "The message to be passed to the agent.",
                            }
                        },
                        "required": ["agent", "message"]
                    }
                }
            }
        ]

        messages = []
        messages.append({"role": "system", "content": self.instructions})
        messages.append({"role": "assistant", "content": history})
        messages.append({"role": "assistant", "content": message_input})

        response = self.openai_client.chat.completions.create(
            messages=messages, 
            model=self.model, 
            tools=tools,
            tool_choice={"type": "function", "function": {"name": "pass_message_to_agent"}}
            )
        
        arguments = json.loads(response.choices[0].message.tool_calls[0].function.arguments)

        message_to_agent = arguments["message"]
        next_agent = arguments["agent"]
        print(f"Message to {next_agent}:\n{message_to_agent}\n")

        return next_agent, message_to_agent
    
    def build_history(self, conversation_id: str):
        # Query the Cosmos DB for the conversation history
        query = f"SELECT c.event_data.message, c.event_data.next_agent, c.event_producer, c.timestamp FROM c WHERE c.conversation_id = @conversation_id ORDER BY c.timestamp"
        parameters = [{"name": "@conversation_id", "value": conversation_id}]
        items = self.cosmos_events_container.query_items(query=query, parameters=parameters)
        lines = []
        lines.append("# Conversation History:")
        for item in items:
            lines.append(f"## From: {item['event_producer']}")
            lines.append(f"{item['message']}\n")
        history = "\n".join(lines)
        return history