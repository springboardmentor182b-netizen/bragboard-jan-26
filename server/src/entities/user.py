import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship

from src.database.core import Base

class UserRole(str, enum.Enum):
    """User role types."""
    admin = "admin"
    employee = "employee"
    user = "user"

class UserStatus(str, enum.Enum):
    """User approval status."""
    approved = "approved"
    pending = "pending"
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

    # Relationships from HEAD
    sent_shoutouts = relationship("Shoutout", back_populates="sender")
    comments = relationship("Comment", back_populates="user")
    reactions = relationship("Reaction", back_populates="user")

    # Reports submitted by this user
    reports = relationship("Report", foreign_keys="Report.reported_by", back_populates="reporter")

    admin_logs = relationship("AdminLog", back_populates="admin")

    notifications = relationship("Notification", back_populates="user", foreign_keys="Notification.user_id")
