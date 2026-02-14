from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional

# This creates the dropdown menu in Swagger
class UserRole(str, Enum):
    admin = "admin"
    employee = "employee"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.employee  # Default is employee

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    role: str