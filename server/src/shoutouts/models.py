from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ShoutoutCreate(BaseModel):
    message: str
    recipient_ids: List[int]
    department: Optional[str] = None
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None

class ShoutoutResponse(BaseModel):
    id: int
    sender_id: int
    sender_name: Optional[str] = None
    department: Optional[str] = None
    message: str
    created_at: datetime
    recipient_ids: List[int]
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None

    class Config:
        from_attributes = True

class ShoutoutListResponse(BaseModel):
    total: int
    shoutouts: List[ShoutoutResponse]

class ShoutoutFilter(BaseModel):
    department: Optional[str] = None
    sender_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    recipient_id: Optional[int] = None
