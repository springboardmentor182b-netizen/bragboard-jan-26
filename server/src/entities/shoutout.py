from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.config import Base

class ShoutOut(Base):
    __tablename__ = "shoutouts"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender_name = Column(String, nullable=True)
    department = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    attachment_url = Column(String, nullable=True)
    attachment_type = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships - simplified
    recipients = relationship("ShoutOutRecipient", back_populates="shoutout", cascade="all, delete")
