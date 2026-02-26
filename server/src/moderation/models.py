from pydantic import BaseModel
from datetime import datetime

class ReportOut(BaseModel):
    id: int
    shoutout_id: int
    reason: str
    message: str  # The text of the shoutout
    reported_by_username: str

    class Config:
        from_attributes = True