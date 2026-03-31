from pydantic import BaseModel
from datetime import datetime
from typing import List
from src.users.schemas import UserResponse

class ShoutoutCreate(BaseModel):
    sender_id: int
    recipient_ids: List[int]
    message: str
    tag_names: List[str]

class ShoutoutResponse(BaseModel):
    id: int
    sender: UserResponse
    recipients: List[UserResponse]
    message: str
    tags: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    shoutouts_received: int
    shoutouts_given: int
    leaderboard_rank: int
    recent_shoutouts: List[ShoutoutResponse]