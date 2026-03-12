from datetime import datetime
from pydantic import BaseModel


class ModerationNoteCreate(BaseModel):
    shoutout_id: int
    message: str


class ModerationNoteResponse(BaseModel):
    id: int
    shoutout_id: int
    admin_id: int
    admin_name: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class RejectShoutoutRequest(BaseModel):
    reason: str
