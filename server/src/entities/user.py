from datetime import datetime
import enum

from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship

# ✅ FIXED: Use connection.py
from src.database.connection import Base

class UserRole(str, enum.Enum):
    """User role types."""
    employee = "employee"
    admin = "admin"

class UserStatus(str, enum.Enum):
    """User approval status."""
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    suspended = "suspended"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    department = Column(String, nullable=True)

    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.employee)

    status = Column(SQLEnum(UserStatus), nullable=False, default=UserStatus.pending)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    rejection_reason = Column(String, nullable=True)

    joined_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    security_question = Column(String, nullable=True)
    security_answer = Column(String, nullable=True)

    # ─── Relationships ────────────────────────────────────────────────────────

    # Self-referential: the admin who approved this user
    approver = relationship(
        "User",
        remote_side=[id],
        foreign_keys=[approved_by],
    )

    # Reports submitted by this user
    reports = relationship("Report", foreign_keys="Report.reported_by", back_populates="reporter")

    # ✅ FIXED: Indented correctly and "Add to..." text removed
    notifications = relationship("Notification", back_populates="user", foreign_keys="Notification.user_id")