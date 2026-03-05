from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

# ✅ FIXED: Use connection.py (not core.py — core.py only exists in main branch)
from src.database.connection import Base


class AdminLog(Base):
    """
    Tracks all admin actions for audit trail.
    Records who did what, when, and to which resource.
    """
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)      # e.g. "Approved user", "Deleted shoutout"
    target_id = Column(Integer, nullable=True)   # ID of the affected resource
    target_type = Column(String, nullable=True)  # "user", "shoutout", etc.
    timestamp = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ✅ FIXED: Relationship intentionally removed.
    #
    # Root cause of the 500 error:
    #   The original admin_log.py defined:
    #     admin = relationship("User", back_populates="admin_logs")
    #   but User had NO matching `admin_logs` property — SQLAlchemy crashed at
    #   mapper initialisation time with:
    #     "Mapper[User(users)] has no property 'admin_logs'"
    #
    # The fix: drop the ORM relationship here.  The admin user can still be
    # fetched on demand without any relationship defined:
    #   from src.entities.user import User
    #   admin_user = db.query(User).filter(User.id == log.admin_id).first()