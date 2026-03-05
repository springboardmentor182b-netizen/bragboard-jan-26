from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    """User role enumeration for authorization"""
    EMPLOYEE = "employee"
    MANAGER = "manager"
    ADMIN = "admin"

class TokenData(BaseModel):
    """Schema for JWT token data"""
    user_id: int
    email: str
    role: str
    
class LoginRequest(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Schema for login response"""
    access_token: str
    token_type: str
    user: dict

class RegisterRequest(BaseModel):
    """Schema for user registration"""
    name: str
    email: EmailStr
    password: str
    department: str

# Admin authorization helpers
def is_admin(user_role: str) -> bool:
    """Check if user is admin"""
    return user_role == UserRole.ADMIN.value

def is_manager_or_admin(user_role: str) -> bool:
    """Check if user is manager or admin"""
    return user_role in [UserRole.MANAGER.value, UserRole.ADMIN.value]

def can_access_admin_dashboard(user_role: str) -> bool:
    """Check if user can access admin dashboard"""
    return is_manager_or_admin(user_role)

def can_manage_users(user_role: str) -> bool:
    """Check if user can manage other users"""
    return is_admin(user_role)

def can_delete_shoutouts(user_role: str) -> bool:
    """Check if user can delete any shout-out"""
    return is_manager_or_admin(user_role)

def can_view_reports(user_role: str) -> bool:
    """Check if user can view flagged content"""
    return is_manager_or_admin(user_role)
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    message: str

