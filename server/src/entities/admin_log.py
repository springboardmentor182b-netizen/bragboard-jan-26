from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, VARCHAR
from sqlalchemy.sql import func
from src.database.config import Base

class AdminLog(Base):
    __tablename__ = "admin_logs"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(Text, nullable=False)
    target_id = Column(Integer, nullable=False)
    target_type = Column(VARCHAR(50), nullable=False)
    timestamp = Column(TIMESTAMP, server_default=func.now())
