from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class CommentCreate(BaseModel):
    content: str


class UserSummary(BaseModel):
    id: int
    name: str
    department: Optional[str] = None

    class Config:
        from_attributes = True


class CommentResponse(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    content: str
    created_at: datetime
    user: UserSummary

    class Config:
        from_attributes = True
