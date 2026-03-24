from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from src.database.connection import Base
from datetime import datetime, timezone


class Shoutout(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    tags = Column(String)
    likes = Column(Integer, default=0)
    image_url = Column(String, nullable=True)   # optional attached image
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_shoutouts")
    recipients = relationship("ShoutoutRecipient", back_populates="shoutout", cascade="all, delete-orphan")
    like_records = relationship("ShoutoutLike", back_populates="shoutout", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="shoutout", cascade="all, delete-orphan")


class ShoutoutRecipient(Base):
    __tablename__ = "shoutout_recipients"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    shoutout = relationship("Shoutout", back_populates="recipients")
    recipient = relationship("User", foreign_keys=[recipient_id])
