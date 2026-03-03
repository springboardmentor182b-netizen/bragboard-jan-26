from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    job_title: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    joined_at: datetime
    
    class Config:
        from_attributes = True

class UserStats(BaseModel):
    user: UserResponse
    shoutouts_received: int
    shoutouts_given: int
    leaderboard_rank: int
    top_tags: List[dict]