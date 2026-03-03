from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from src.database.connection import Base
import datetime
import enum


class UserRole(enum.Enum):
    employee = "employee"
    admin = "admin"


class UserStatus(enum.Enum):
    """User approval status for admin workflow"""
    pending = "pending"      # Waiting for admin approval
    approved = "approved"    # Approved by admin, can login
    rejected = "rejected"    # Rejected by admin
    suspended = "suspended"  # Temporarily suspended


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String)
    role = Column(Enum(UserRole), default=UserRole.employee)
    
    # Security question fields (existing)
    security_question = Column(String)
    security_answer = Column(String)
    
    # NEW: Approval workflow fields
    status = Column(Enum(UserStatus), default=UserStatus.pending, nullable=False)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(String, nullable=True)
    
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship for the admin who approved this user
    approver = relationship("User", remote_side=[id], foreign_keys=[approved_by])