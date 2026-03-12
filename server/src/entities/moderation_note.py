from datetime import datetime

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from src.database.core import Base


class ModerationNote(Base):
    __tablename__ = "moderation_notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    shoutout = relationship("Shoutout", back_populates="moderation_notes")
    admin = relationship("User")
