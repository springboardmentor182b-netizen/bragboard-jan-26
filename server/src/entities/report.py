from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.sql import func
from src.database.config import Base

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    resolved = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
