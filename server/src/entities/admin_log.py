from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database.connection import Base
import datetime


class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)          # e.g. "Deleted shoutout"
    target_id = Column(Integer, nullable=True)       # ID of the affected record
    target_type = Column(String, nullable=True)      # e.g. "shoutout", "user"
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    admin = relationship("User", foreign_keys=[admin_id])
