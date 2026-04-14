from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from src.database.config import Base

class ShoutOutRecipient(Base):
    __tablename__ = "shoutout_recipients"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shoutout = relationship("ShoutOut", back_populates="recipients")
