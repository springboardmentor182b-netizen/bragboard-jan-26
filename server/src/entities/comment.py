from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database.core import Base
from datetime import datetime

class ShoutoutComment(Base):
    __tablename__ = "shoutout_comments"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    shoutout = relationship("Shoutout", back_populates="comments")
    user = relationship("User")
