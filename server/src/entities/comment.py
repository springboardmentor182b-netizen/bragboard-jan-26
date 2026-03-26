from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database.connection import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # NEW: parent_id enables one level of nested replies
    parent_id = Column(Integer, ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    # Relationships
    shoutout = relationship("Shoutout", foreign_keys=[shoutout_id])
    user = relationship("User", foreign_keys=[user_id])

    # Self-referential: replies to this comment
    replies = relationship(
        "Comment",
        foreign_keys=[parent_id],
        back_populates="parent",
        cascade="all, delete-orphan",
        order_by="Comment.created_at",
    )
    # The parent comment (None for top-level)
    parent = relationship(
        "Comment",
        foreign_keys=[parent_id],
        remote_side=[id],
        back_populates="replies",
    )