from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List


class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None  # None = top-level, int = reply to that comment


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
    parent_id: Optional[int] = None
    content: str
    created_at: datetime
    user: UserSummary
    replies: List['CommentResponse'] = []  # nested replies (one level deep)

    class Config:
        from_attributes = True


# Required for self-referencing Pydantic model
CommentResponse.model_rebuild()