from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.connection import Base

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    shoutout = relationship("ShoutOut", back_populates="comments")
    user = relationship("User")