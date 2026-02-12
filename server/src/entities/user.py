from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
import enum
from src.database.core import Base

class UserRole(str, enum.Enum):
    employee = "employee"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # This will store the HASHED password
    department = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.employee)
    joined_at = Column(TIMESTAMP, server_default=func.now())