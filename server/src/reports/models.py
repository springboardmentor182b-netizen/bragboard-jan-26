from pydantic import BaseModel
from datetime import datetime

class ReportOut(BaseModel):
    id: int
    shoutout_id: int
    reported_by: str
    reason: str
    created_at: datetime
