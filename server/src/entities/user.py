from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.config import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String)
    job_title = Column(String)
    joined_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    sent_shoutouts = relationship("Shoutout", foreign_keys="Shoutout.sender_id", back_populates="sender")
    received_shoutouts = relationship("ShoutoutRecipient", back_populates="recipient")