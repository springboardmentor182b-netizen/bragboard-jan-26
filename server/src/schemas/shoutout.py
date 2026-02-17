from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from src.schemas.user import User

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime
    user_id: int
    user: Optional[User] = None
    class Config:
        from_attributes = True

class ShoutoutBase(BaseModel):
    content: str

class ShoutoutCreate(ShoutoutBase):
    recipient_ids: List[int]
    tags: List[str]

class Shoutout(ShoutoutBase):
    id: int
    created_at: datetime
    sender_id: int
    sender: Optional[User] = None
    recipients: List[User] = []
    tags: List[Tag] = []
    comments: List[Comment] = []
    # reactions: List[Reaction] = [] # Todo

    class Config:
        from_attributes = True
