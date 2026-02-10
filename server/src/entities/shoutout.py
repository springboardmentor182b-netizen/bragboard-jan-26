from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from src.database.core import Base
import datetime

class Shoutout(Base):
    __tablename__ = "shoutouts"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    tags = Column(String) 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    sender = relationship("src.entities.user.User", backref="sent_shoutouts")
    recipients = relationship("ShoutoutRecipient", back_populates="shoutout")

class ShoutoutRecipient(Base):
    __tablename__ = "shoutout_recipients"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))

    shoutout = relationship("Shoutout", back_populates="recipients")
    recipient = relationship("src.entities.user.User")