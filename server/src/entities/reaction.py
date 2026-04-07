"""
Reaction Model
Database model for reactions (like, clap, star)
"""
from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from src.database.connection import Base

class ReactionType(str, enum.Enum):
    LIKE = "like"
    CLAP = "clap"
    STAR = "star"

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(ReactionType), nullable=False)

    # ✅ Fixed: "ShoutOut" → "Shoutout"
    shoutout = relationship("Shoutout", back_populates="reactions")
    user = relationship("User")

    def __repr__(self):
        return f"<Reaction(id={self.id}, type={self.type})>"

    def to_dict(self):
        return {
            "id": self.id,
            "shoutout_id": self.shoutout_id,
            "user_id": self.user_id,
            "type": self.type.value
        }