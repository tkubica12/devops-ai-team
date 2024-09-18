from openai import AzureOpenAI
import time
import json
from SharedClasses.Event import Event, AgentCommunicationData
from uuid import uuid4
from pydantic import BaseModel, Field
from typing import Union, Optional

class AgentConfiguration(BaseModel):
    instructions: str = Field(..., title="Instructions", description="Instructions for the agent")
    intent_extraction_instructions: Optional[str] = Field(None, title="Intent Extraction Instructions", description="Instructions for extracting intents from the user message")
    model: str = Field(..., title="Model", description="Model to use for generating responses")
    embedding_model: Optional[str] = Field(None, title="Embedding Model", description="Model to use for generating embeddings")
    event_producer: str = Field(..., title="Event Producer", description="Producer of event, which is name of the agent")
    rag_top_n: Optional[int] = Field(None, title="RAG Top N", description="Top N responses to consider from RAG model")

class Agent:
    def __init__(self, openai_client: AzureOpenAI, agent_config: AgentConfiguration, cosmos_events_container, cosmos_rag_container = None):
        self.openai_client = openai_client
        self.agent_config = agent_config
        self.cosmos_events_container = cosmos_events_container
        self.cosmos_rag_container = cosmos_rag_container

    def process(self, message_input: str, conversation_id: str, context: str = None):
        print(f"Input message:\n{message_input}\n")
        message_output = self.call_model(
            message_input=message_input, 
            history=self.build_history(conversation_id=conversation_id), 
            instructions=self.agent_config.instructions,
            context=context
            )
        self.create_event(
            message=message_output, 
            next_agent="agent_facilitator", 
            conversation_id=conversation_id
            )
        
    def extract_intent(self, message_input: str, conversation_id: str):
        message_output = self.call_model(
            message_input=message_input, 
            history=self.build_history(conversation_id=conversation_id),
            instructions=self.agent_config.intent_extraction_instructions
            )
        return message_output

    def create_event(self, message: str, next_agent: str, conversation_id: str):
        event_data = AgentCommunicationData(
            message=message,
            next_agent=next_agent
        )
        event = Event(
            event_type="agent_communication",
            conversation_id=conversation_id,
            id=str(uuid4()),
            event_producer=self.agent_config.event_producer,
            event_data=event_data,
            timestamp=int(time.time())
        )
        # Send the event to Cosmos DB
        self.cosmos_events_container.create_item(event.model_dump())
    
    def call_model(self, message_input: str, instructions: str, history: str = None, context: str = None):
        # Prepare the messages for the model
        messages = []
        messages.append({"role": "system", "content": instructions})
        messages.append({"role": "assistant", "content": history})
        if context:
            messages.append({"role": "user", "content": context})
        messages.append({"role": "user", "content": message_input})

        # Send the messages to the model
        response = self.openai_client.chat.completions.create(
            messages=messages, 
            model=self.agent_config.model
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
    
    def search(self, input: str):
        try:
            input_embedding = self.openai_client.embeddings.create(input=input, model=self.agent_config.embedding_model).data[0].embedding
            query = f"SELECT TOP @top_n c.text, VectorDistance(c.contentVector,@embedding) AS SimilarityScore FROM c ORDER BY VectorDistance(c.contentVector,@embedding)"
            parameters = [
                {"name": "@top_n", "value": self.agent_config.rag_top_n},
                {"name": "@embedding", "value": input_embedding}
            ]
            items = self.cosmos_rag_container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True)
            lines = []
            lines.append("# Search Results:")
            for item in items:
                print(json.dumps(item, indent=2))
                lines.append(f"{item['text']}\n")
            search_results = "\n".join(lines)
            print(f">>>>>>>>>>> Search Results:\n{search_results}\n")
            return search_results
        except Exception as e:
            print(f"An error occurred during search: {e}")
            return ""

    