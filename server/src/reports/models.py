from pydantic import BaseModel
from typing import List
from datetime import datetime

class ReportCreate(BaseModel):
    shoutout_id: int
    reason: str

class ReportResponse(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    created_at: datetime
    resolved: bool = False

    class Config:
        from_attributes = True

class ReportListResponse(BaseModel):
    total: int
    reports: List[ReportResponse]
