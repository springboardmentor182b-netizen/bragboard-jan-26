from pydantic import BaseModel
from typing import List
from datetime import datetime

class AdminLogResponse(BaseModel):
    id: int
    admin_id: int
    action: str
    target_id: int
    target_type: str
    timestamp: datetime

    class Config:
        from_attributes = True

class AdminLogListResponse(BaseModel):
    total: int
    logs: List[AdminLogResponse]

class AdminShoutoutResponse(BaseModel):
    id: int
    sender_id: int
    message: str
    created_at: datetime
    report_count: int = 0
    is_flagged: bool = False

    class Config:
        from_attributes = True

class AdminShoutoutListResponse(BaseModel):
    total: int
    shoutouts: List[AdminShoutoutResponse]
