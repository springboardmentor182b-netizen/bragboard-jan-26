from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ShoutoutCreate(BaseModel):
    sender_id: int
    message: str
    recipient_ids: List[int]
    tags: List[str]

class UserSummary(BaseModel):
    id: int
    name: str

class ShoutoutResponse(BaseModel):
    id: int
    sender: UserSummary
    message: str
    tags: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserSummary(BaseModel):
    id: int
    name: str
    department: Optional[str] = "General"  # Add this

class ShoutoutResponse(BaseModel):
    id: int
    sender: UserSummary
    message: str
    tags: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# --- NEW SCHEMAS BELOW ---
class LeaderboardEntry(BaseModel):
    id: int
    name: str
    department: str
    score: int

class DepartmentStat(BaseModel):
    name: str
    member_count: int
    shoutout_count: int 