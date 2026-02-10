from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ShoutoutCreate(BaseModel):
    sender_id: int
    message: str
    recipient_ids: List[int]
    tags: List[str]

class ShoutoutResponse(BaseModel):
    id: int
    message: str
    created_at: datetime
    # Add other fields as needed for the UI
    class Config:
        from_attributes = True