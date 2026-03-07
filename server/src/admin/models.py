"""
Pydantic schemas for admin endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Analytics response schemas ──────────────────────────────────────────────

class AdminStatsResponse(BaseModel):
    total_users: int
    total_shoutouts: int
    total_likes: int
    total_flagged: int


class TopPerformerResponse(BaseModel):
    name: str
    department: str
    count: int


class CategoryStatResponse(BaseModel):
    name: str
    count: int


class AnalyticsResponse(BaseModel):
    stats: AdminStatsResponse
    top_performers: List[TopPerformerResponse]
    category_stats: List[CategoryStatResponse]


# ── User Management schemas ────────────────────────────────────────────────

class UserAdminResponse(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = "General"
    role: str
    joined_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserRoleUpdate(BaseModel):
    role: str  # "employee" or "admin"


class UserDeleteResponse(BaseModel):
    message: str
    deleted_user_id: int


# ── Moderation schemas ─────────────────────────────────────────────────────

class FlaggedShoutoutResponse(BaseModel):
    id: int
    sender_name: str
    sender_email: str
    message: str
    tags: Optional[str] = None
    likes: Optional[int] = 0
    is_flagged: bool
    created_at: datetime
    recipient_names: List[str] = []


class FlagActionResponse(BaseModel):
    message: str
    shoutout_id: int
    is_flagged: bool


# ── Audit Log schemas ──────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    id: int
    admin_name: str
    action: str
    target_type: str
    target_id: Optional[int] = None
    details: Optional[str] = None
    created_at: datetime
