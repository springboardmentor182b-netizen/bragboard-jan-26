from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class UserSummary(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


class ReactionCount(BaseModel):
    like: int = 0
    clap: int = 0
    star: int = 0


class CommentOut(BaseModel):
    id: int
    user_id: int
    user_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ShoutOutOut(BaseModel):
    id: int
    sender_id: int
    sender_name: str
    sender_department: Optional[str] = None
    message: str
    created_at: datetime
    recipients: List[UserSummary] = []
    reaction_counts: ReactionCount = ReactionCount()
    comments: List[CommentOut] = []
    total_comments: int = 0

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_shoutouts_received: int
    total_shoutouts_sent: int
    total_reactions_received: int
    total_comments_received: int


class EmployeeDashboardResponse(BaseModel):
    user: UserSummary
    stats: DashboardStats
    recent_received_shoutouts: List[ShoutOutOut] = []
    recent_sent_shoutouts: List[ShoutOutOut] = []


class ShoutOutFeedResponse(BaseModel):
    shoutouts: List[ShoutOutOut]
    total: int
    page: int
    page_size: int


class LeaderboardEntry(BaseModel):
    user_id: int
    user_name: str
    department: Optional[str] = None
    shoutouts_received: int
    reactions_received: int


class LeaderboardResponse(BaseModel):
    top_employees: List[LeaderboardEntry]
