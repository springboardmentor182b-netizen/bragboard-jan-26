from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ShoutoutCreate(BaseModel):
    message: str
    recipient_ids: List[int]


class ShoutoutRecipientResponse(BaseModel):
    id: int
    recipient_id: int

    class Config:
        from_attributes = True


class ShoutoutResponse(BaseModel):
    id: int
    sender_id: int
    message: str
    created_at: datetime
    shoutout_recipients: List[ShoutoutRecipientResponse] = []

    class Config:
        from_attributes = True
