from datetime import datetime, timezone

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

# ✅ FIXED: Use connection.py (feature branch) not core.py (main branch)
from src.database.connection import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    shoutout_id = Column(
        Integer,
        ForeignKey("shoutouts.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    content = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # ✅ NOTE: No back_populates used here.
    # The feature branch's shoutout.py and user.py do not define
    # `comments` properties, so back_populates would crash the mapper.
    # Relationships are intentionally one-directional (comment → parent).
    shoutout = relationship("Shoutout", foreign_keys=[shoutout_id])
    user = relationship("User", foreign_keys=[user_id])