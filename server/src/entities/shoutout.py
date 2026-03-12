from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from src.database.core import Base


class ShoutoutRecipient(Base):
    """Association table linking shoutouts to their recipients."""
    __tablename__ = "shoutout_recipients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    shoutout = relationship("Shoutout", back_populates="shoutout_recipients")
    recipient = relationship("src.entities.user.User")


class Shoutout(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    tags = Column(String, nullable=True)
    likes = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    sender = relationship("src.entities.user.User", back_populates="sent_shoutouts")
    shoutout_recipients = relationship(
        "ShoutoutRecipient", back_populates="shoutout", cascade="all, delete-orphan"
    )
    comments = relationship("Comment", back_populates="shoutout", cascade="all, delete-orphan")
    reactions = relationship("Reaction", back_populates="shoutout", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="shoutout", cascade="all, delete-orphan")
    moderation_notes = relationship("ModerationNote", back_populates="shoutout", cascade="all, delete-orphan")
