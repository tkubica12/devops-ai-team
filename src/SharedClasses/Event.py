from pydantic import BaseModel, Field
from typing import Union, Optional

class AgentCommunicationData(BaseModel):
    message: str = Field(..., title="Message", description="Message")
    next_agent: str = Field(..., title="Next Agent", description="Next agent")
    
class Event(BaseModel):
    conversation_id: str = Field(..., title="Conversation ID", description="ID of conversation")
    id: str = Field(..., title="ID", description="ID of event")
    event_type: str = Field(..., title="Event Type", description="Type of event")
    event_producer: str = Field(..., title="Event Producer", description="Producer of event")
    event_data: Union[AgentCommunicationData] = Field(..., title="Event Data", description="Data of event")
    timestamp: int = Field(..., title="Timestamp", description="Timestamp of event")

