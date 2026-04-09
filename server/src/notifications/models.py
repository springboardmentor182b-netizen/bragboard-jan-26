from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class NotificationResponse(BaseModel):
    """Response model for a notification."""
    id: int
    user_id: int
    type: str
    title: str
    message: str
    shoutout_id: Optional[int]
    from_user_id: Optional[int]
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime]
    
    # Optional: Include sender name for convenience
    from_user_name: Optional[str] = None

    class Config:
        from_attributes = True


class UnreadCountResponse(BaseModel):
    """Response model for unread notification count."""
    unread_count: int