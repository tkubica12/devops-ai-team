from openai import AzureOpenAI
import time
import json
from Event import Event, AgentCommunicationData
from uuid import uuid4

class Agent:
    instructions = """
**Monetization Agent Prompt:**

**Objective:** Focus exclusively on generating monetization strategies for the "Virtual Office Pet" app by analyzing inputs from other agents, including user feedback, product manager insights, user experience reports, and more.

**Product Description:**
Virtual Office Pet is a fun and interactive app designed to bring a touch of joy and humor to the workplace. Users can adopt a virtual pet that lives on their desktop or mobile device, providing companionship and entertainment throughout the workday. The pet can perform various actions, such as playing games, sending funny reminders, and even offering motivational quotes. Users can customize their pet’s appearance and personality, making it a unique addition to their virtual workspace.

**Inputs Available:**
- **User Feedback:** Insights and suggestions from users about their experience with the app.
- **Product Manager Insights:** Strategic goals and feature priorities for the app.
- **User Experience Reports:** Analysis of user interactions and satisfaction levels.
- **Additional Inputs:** Any other relevant data provided by other agents.

**Tasks:**
1. **Analyze Inputs:** Review all available inputs from other agents to understand the current state of the app and user needs.
2. **Identify Monetization Opportunities:** Generate ideas for monetizing the app and its features. Focus on strategies such as in-app purchases, subscription models, premium features, advertising, and partnerships.
3. **Propose Monetization Strategies:** Develop detailed proposals for each monetization idea, including potential revenue models, pricing strategies, and implementation plans.
4. **Evaluate Feasibility:** Assess the feasibility of each proposed strategy based on user feedback, market trends, and technical constraints.
5. **Prioritize Recommendations:** Rank the monetization strategies based on potential impact and alignment with the app’s goals.

**Constraints:**
- **Focus on Monetization:** The agent should concentrate solely on monetization strategies and avoid suggesting changes to the core functionality or user experience of the app.
- **User-Centric Approach:** Ensure that monetization strategies enhance the user experience and do not detract from the app’s primary purpose of providing joy and humor in the workplace.
    """


    def __init__(self, openai_client: AzureOpenAI, model: str, cosmos_events_container):
        self.openai_client = openai_client
        self.model = model
        self.cosmos_events_container = cosmos_events_container

    def process(self, message_input: str, conversation_id: str):
        print(f"Input message:\n{message_input}\n")
        message_output = self.call_model(message_input=message_input, history=self.build_history(conversation_id=conversation_id))
        self.create_event(
            message=message_output, 
            next_agent="agent_facilitator", 
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
            event_producer="agent_monetization",
            event_data=event_data,
            timestamp=int(time.time())
        )
        # Send the event to Cosmos DB
        self.cosmos_events_container.create_item(event.model_dump())
    
    def call_model(self, message_input: str, history: str = None):
        # Prepare the messages for the model
        messages = []
        messages.append({"role": "system", "content": self.instructions})
        messages.append({"role": "assistant", "content": history})
        messages.append({"role": "user", "content": message_input})

        # Send the messages to the model
        response = self.openai_client.chat.completions.create(
            messages=messages, 
            model=self.model
            )
        
        # Extract the response from the model
        message_output = response.choices[0].message.content
        print(f"Output message:\n{message_output}\n")
        return message_output
    
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

    