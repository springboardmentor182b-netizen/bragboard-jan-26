from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel



# ── Request schemas ─────────────────────────────────────────────────────────

class ShoutoutCreate(BaseModel):
    message: str
    recipient_ids: List[int]
    tags: Optional[List[str]] = []



# ── Nested summary schemas ───────────────────────────────────────────────────

class UserSummary(BaseModel):
    id: int
    name: str
    department: Optional[str] = "General"
<<<<<<< HEAD
=======

    class Config:
        from_attributes = True


class RecipientSummary(BaseModel):
    id: int
    recipient: UserSummary

    class Config:
        from_attributes = True


# ── Response schemas ─────────────────────────────────────────────────────────
>>>>>>> origin/main-group-D


class ShoutoutRecipientResponse(BaseModel):
    id: int
<<<<<<< HEAD
    recipient_id: int
=======
    sender: UserSummary
    message: str
    tags: Optional[str] = None
    likes: Optional[int] = 0
    created_at: datetime
    recipients: Optional[List[RecipientSummary]] = []
>>>>>>> origin/main-group-D

    class Config:
        from_attributes = True


<<<<<<< HEAD
class ShoutoutResponse(BaseModel):
    id: int
    sender_id: int
    sender: Optional[UserSummary] = None
    message: str
    tags: Optional[str] = None
    created_at: datetime
    likes: int = 0
    shoutout_recipients: List[ShoutoutRecipientResponse] = []

    class Config:
        from_attributes = True


=======
# ── Leaderboard & department schemas ────────────────────────────────────────

>>>>>>> origin/main-group-D
class LeaderboardEntry(BaseModel):
    id: int
    name: str
    department: Optional[str] = "General"
    score: int


class DepartmentStat(BaseModel):
    name: str
    member_count: int
    shoutout_count: int
