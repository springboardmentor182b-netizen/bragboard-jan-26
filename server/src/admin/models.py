from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AdminStatsResponse(BaseModel):
    total_users: int
    total_shoutouts: int
    total_likes: int
    active_this_week: int


class UserAdminView(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str]
    role: str
    joined_at: Optional[datetime]

    class Config:
        from_attributes = True


class ShoutoutAdminView(BaseModel):
    id: int
    sender_name: str
    sender_email: str
    message: str
    tags: Optional[str]
    likes: int
    created_at: datetime
    recipient_names: list[str]


class AdminLogResponse(BaseModel):
    id: int
    admin_id: int
    admin_name: str
    action: str
    target_id: Optional[int]
    target_type: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True


class DeleteShoutoutResponse(BaseModel):
    message: str
    shoutout_id: int


class ChangeRoleRequest(BaseModel):
    role: str  # "employee" or "admin"


class DepartmentStatItem(BaseModel):
    name: str
    member_count: int
    shoutout_count: int
