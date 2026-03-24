from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from src.database.connection import Base
import datetime
import enum


class UserRole(enum.Enum):
    user = "user"
    employee = "employee"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String)
    role = Column(Enum(UserRole), default=UserRole.employee)
    security_question = Column(String)
    security_answer = Column(String)
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)