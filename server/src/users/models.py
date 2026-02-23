"""
User Models
Database models for users
"""

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
import enum
from src.database.connection import Base

class UserRole(str, enum.Enum):
    """User role enumeration"""
    EMPLOYEE = "employee"
    MANAGER = "manager"
    ADMIN = "admin"

class User(Base):
    """User table model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE, nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "role": self.role.value,
            "joined_at": self.joined_at.isoformat() if self.joined_at else None
        }
