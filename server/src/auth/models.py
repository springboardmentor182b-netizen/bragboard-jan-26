from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


# --- Request Schemas ---

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# --- Response Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = None
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True
