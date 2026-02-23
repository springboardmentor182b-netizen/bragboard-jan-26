"""
Reaction Model
Database model for reactions (like, clap, star)
"""

from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from src.database.connection import Base

class ReactionType(str, enum.Enum):
    """Reaction type enumeration"""
    LIKE = "like"
    CLAP = "clap"
    STAR = "star"

class Reaction(Base):
    """Reactions table model"""
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(ReactionType), nullable=False)
    
    # Relationships
    shoutout = relationship("ShoutOut", back_populates="reactions")
    user = relationship("User")
    
    def __repr__(self):
        return f"<Reaction(id={self.id}, type={self.type})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "shoutout_id": self.shoutout_id,
            "user_id": self.user_id,
            "type": self.type.value
        }
