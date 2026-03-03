from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from src.database.connection import Base
from datetime import datetime, timezone


class ShoutoutLike(Base):
    """Tracks which users liked which shoutouts."""
    __tablename__ = "shoutout_likes"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Prevent duplicate likes
    __table_args__ = (
        UniqueConstraint('shoutout_id', 'user_id', name='unique_user_like'),
    )

    # Relationships
    shoutout = relationship("Shoutout", back_populates="like_records")
    user = relationship("User", foreign_keys=[user_id])