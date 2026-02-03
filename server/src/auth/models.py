from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    department: str
    role: str
    joined_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
