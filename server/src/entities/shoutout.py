from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database.core import Base
from datetime import datetime

class Shoutout(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

    reactions = relationship("ShoutoutReaction", back_populates="shoutout", cascade="all, delete-orphan")
    comments = relationship("ShoutoutComment", back_populates="shoutout", cascade="all, delete-orphan")

