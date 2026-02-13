from pydantic import BaseModel, EmailStr
from enum import Enum


class RoleEnum(str, Enum):
    employee = "employee"
    admin = "admin"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: str
    role: RoleEnum

    class Config:
        orm_mode = True
