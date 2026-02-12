from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ShoutoutCreate(BaseModel):
    message: str
    recipient_ids: List[int]
    tags: Optional[List[str]] = []


class UserSummary(BaseModel):
    id: int
    name: str
    department: Optional[str] = "General"


class ShoutoutRecipientResponse(BaseModel):
    id: int
    recipient_id: int

    class Config:
        from_attributes = True


class ShoutoutResponse(BaseModel):
    id: int
    sender_id: int
    sender: Optional[UserSummary] = None
    message: str
    tags: Optional[str] = None
    created_at: datetime
    likes: int = 0
    shoutout_recipients: List[ShoutoutRecipientResponse] = []

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    id: int
    name: str
    department: str
    score: int


class DepartmentStat(BaseModel):
    name: str
    member_count: int
    shoutout_count: int
