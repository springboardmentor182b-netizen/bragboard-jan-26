from pydantic import BaseModel
from typing import List
from datetime import datetime
from src.auth.models import UserResponse

class ShoutOutResponse(BaseModel):
    id: int
    sender: UserResponse
    message: str
    created_at: datetime
    recipients: List[UserResponse]
    reaction_counts: dict
    comment_count: int
    
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_shoutouts_received: int
    total_shoutouts_sent: int
    recent_shoutouts: List[ShoutOutResponse]
