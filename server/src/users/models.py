from pydantic import BaseModel
from typing import Optional

# Based on your Database Schema
class UserItem(BaseModel):
    id: int
    name: str
    email: str
    dept: str
    role: str
    status: str
    joined: str
    initial: str
    color: str

class LogItem(BaseModel):
    id: int
    type: str
    title: str
    badge: str
    desc: str
    user: str
    ip: str
    time: str

class AnalyticsData(BaseModel):
    stats: list
    top_employees: list
    top_categories: list