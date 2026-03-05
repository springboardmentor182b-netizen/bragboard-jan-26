from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

# ✅ FIXED: Use connection.py (feature branch) not core.py (main branch)
from src.database.connection import Base


class Reaction(Base):
    __tablename__ = "reactions"

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
    # Reaction type: "like", "clap", "star"
    type = Column(String, nullable=False)

    # One reaction type per user per shoutout (no duplicates)
    __table_args__ = (
        UniqueConstraint(
            "shoutout_id", "user_id", "type",
            name="uq_reaction_user_shoutout_type",
        ),
    )

    # ✅ NOTE: No back_populates used here.
    # The feature branch's shoutout.py and user.py do not define
    # `reactions` properties, so back_populates would crash the mapper.
    shoutout = relationship("Shoutout", foreign_keys=[shoutout_id])
    user = relationship("User", foreign_keys=[user_id])