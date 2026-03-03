from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserMinimal(BaseModel):
    id: int
    email: str
    
    class Config:
        orm_mode = True

class ShoutoutCommentOut(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    message: str
    created_at: datetime
    user: UserMinimal

    class Config:
        orm_mode = True

class ShoutoutReactionOut(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    type: str

    class Config:
        orm_mode = True

class ShoutoutBase(BaseModel):
    receiver_id: int
    message: str

class ShoutoutCreate(ShoutoutBase):
    pass

class ShoutoutOut(ShoutoutBase):
    id: int
    sender_id: int
    created_at: datetime
    sender: UserMinimal
    receiver: UserMinimal
    reactions: List[ShoutoutReactionOut] = []
    comments: List[ShoutoutCommentOut] = []

    class Config:
        orm_mode = True

class ShoutoutStats(BaseModel):
    total_this_week: int
    top_value: str
    your_kudos: int

class CommentCreate(BaseModel):
    message: str

class ReactionCreate(BaseModel):
    type: str # 'thumbs_up', 'heart', 'star'
