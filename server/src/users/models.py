from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = None
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True
