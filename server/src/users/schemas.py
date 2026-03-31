from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import List


class RoleEnum(str, Enum):
    employee = "employee"
    admin = "admin"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str
    role: RoleEnum = RoleEnum.employee


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


class UserStats(BaseModel):
    user: UserResponse
    shoutouts_received: int
    shoutouts_given: int
    leaderboard_rank: int
    top_tags: List[dict]

    class Config:
        orm_mode = True
