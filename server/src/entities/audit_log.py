from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from src.database.connection import Base
import datetime


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)          # e.g. "delete_shoutout", "change_role"
    target_type = Column(String, nullable=False)      # "user" | "shoutout"
    target_id = Column(Integer)                       # ID of the affected record
    details = Column(Text)                            # Human-readable details
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    admin = relationship("User", foreign_keys=[admin_id])
