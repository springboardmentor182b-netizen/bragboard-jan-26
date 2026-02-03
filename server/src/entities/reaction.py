from sqlalchemy import Column, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from src.database.connection import Base

class ReactionType(str, enum.Enum):
    like = "like"
    clap = "clap"
    star = "star"

class Reaction(Base):
    __tablename__ = "reactions"
    
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(SQLEnum(ReactionType))
    
    shoutout = relationship("ShoutOut", back_populates="reactions")
    user = relationship("User")