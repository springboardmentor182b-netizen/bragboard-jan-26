from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.core import Base

class Comment(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    shoutout_id = Column(Integer, ForeignKey("shoutout.id"))
    user_id = Column(Integer, ForeignKey("user.id"))

    shoutout = relationship("Shoutout", back_populates="comments")
    user = relationship("User")
