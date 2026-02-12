from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from src.database.core import Base


class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(Text, nullable=False)
    target_id = Column(Integer, nullable=True)
    target_type = Column(String, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    admin = relationship("User", back_populates="admin_logs")
