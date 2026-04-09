from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from src.database.connection import Base


class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # EXPANDED: Now supports 9 reaction types instead of 3!
    # Options: "like", "clap", "star", "heart", "fire", "celebrate", "wow", "thumbsup", "rocket"
    type = Column(String, nullable=False)

    __table_args__ = (
        UniqueConstraint("shoutout_id", "user_id", "type", name="uq_reaction_user_shoutout_type"),
    )

    shoutout = relationship("Shoutout", foreign_keys=[shoutout_id])
    user = relationship("User", foreign_keys=[user_id])