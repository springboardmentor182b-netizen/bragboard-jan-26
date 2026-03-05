from datetime import datetime
import enum

from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship

# ✅ FIXED: Use connection.py (not core.py — core.py only exists in main branch)
from src.database.connection import Base


class UserRole(str, enum.Enum):
    """User role types. Using str mixin so .value serializes cleanly."""
    employee = "employee"
    admin = "admin"


class UserStatus(str, enum.Enum):
    """User approval status for admin workflow."""
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

    # ✅ FIXED: Using SQLEnum with the Python enum class
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.employee)

    # Approval workflow fields
    status = Column(SQLEnum(UserStatus), nullable=False, default=UserStatus.pending)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    rejection_reason = Column(String, nullable=True)

    joined_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    security_question = Column(String, nullable=True)
    security_answer = Column(String, nullable=True)  # stored as bcrypt hash

    # ─── Relationships ────────────────────────────────────────────────────────

    # ✅ NOTE: sent_shoutouts is created automatically by backref="sent_shoutouts"
    # in shoutout.py → DO NOT redefine it here (causes SQLAlchemy conflict)

    # Self-referential: the admin who approved this user
    approver = relationship(
        "User",
        remote_side=[id],
        foreign_keys=[approved_by],
    )

    # ✅ FIXED: admin_logs relationship REMOVED here.
    # admin_log.py no longer uses back_populates="admin_logs".
    # AdminLog.admin_id is a plain ForeignKey; query it manually when needed:
    #   db.query(AdminLog).filter(AdminLog.admin_id == user.id).all()