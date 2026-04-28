from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReportCreate(BaseModel):
    shoutout_id: int
    reason: str


class ReportResponse(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    created_at: datetime

    class Config:
        from_attributes = True
