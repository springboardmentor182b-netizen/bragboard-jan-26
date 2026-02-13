from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

# 1. Define the possible roles to prevent typos
class UserRole(str, Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"
    MANAGER = "manager" # Optional: if you need more roles later

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str
    # 2. Change role to use the Enum, defaulting to employee
    role: UserRole = UserRole.EMPLOYEE

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    # 3. Useful to include the role in the response so the frontend knows immediately
    role: str