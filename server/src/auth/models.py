from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "employee"
    department: str = "General"
    admin_code: Optional[str] = None  # ✅ add this

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    message: str