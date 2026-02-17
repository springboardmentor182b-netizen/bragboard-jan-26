"""
Comment Model
Database model for comments on shout-outs
"""

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.connection import Base

class Comment(Base):
    """Comments table model"""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shoutout = relationship("ShoutOut", back_populates="comments")
    user = relationship("User")
    
    def __repr__(self):
        return f"<Comment(id={self.id}, shoutout_id={self.shoutout_id})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "shoutout_id": self.shoutout_id,
            "user_id": self.user_id,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
