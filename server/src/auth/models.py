from datetime import datetime
from typing import Optional, Any

from pydantic import BaseModel, EmailStr, Field


# --- Request Schemas ---

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    department: Optional[str] = Field(None, min_length=2, max_length=100)
    security_question: Optional[str] = None
    security_answer: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifySecurityAnswerRequest(BaseModel):
    email: EmailStr
    security_answer: str
    new_password: str = Field(..., min_length=6, max_length=100)


# --- Response Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[Any] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = None
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True
