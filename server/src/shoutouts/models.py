from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ── Request schemas ─────────────────────────────────────────────────────────

class ShoutoutCreate(BaseModel):
    sender_id: int
    message: str
    recipient_ids: List[int]
    tags: List[str]


# ── Nested summary schemas ───────────────────────────────────────────────────

class UserSummary(BaseModel):
    id: int
    name: str
    department: Optional[str] = "General"

    class Config:
        from_attributes = True


class RecipientSummary(BaseModel):
    id: int
    recipient: UserSummary

    class Config:
        from_attributes = True


# ── Response schemas ─────────────────────────────────────────────────────────

class ShoutoutResponse(BaseModel):
    id: int
    sender: UserSummary
    message: str
    tags: Optional[str] = None
    likes: Optional[int] = 0
    created_at: datetime
    recipients: Optional[List[RecipientSummary]] = []

    class Config:
        from_attributes = True


# ── Leaderboard & department schemas ────────────────────────────────────────

class LeaderboardEntry(BaseModel):
    id: int
    name: str
    department: Optional[str] = "General"
    score: int


class DepartmentStat(BaseModel):
    name: str
    member_count: int
    shoutout_count: int
