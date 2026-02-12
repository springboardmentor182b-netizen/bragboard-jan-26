from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AdminLogResponse(BaseModel):
    id: int
    admin_id: int
    action: str
    target_id: Optional[int] = None
    target_type: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
