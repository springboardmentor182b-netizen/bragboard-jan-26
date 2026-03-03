from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportCreate(BaseModel):
    shoutout_id: int
    reason: str


class ReportResolve(BaseModel):
    action: str  # "resolved" or "dismissed"


class ShoutoutSnippet(BaseModel):
    id: int
    message: str
    sender_id: int

    class Config:
        from_attributes = True


class UserSnippet(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class ReportResponse(BaseModel):
    id: int
    shoutout_id: int
    reason: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    shoutout: Optional[ShoutoutSnippet] = None
    reporter: Optional[UserSnippet] = None

    class Config:
        from_attributes = True