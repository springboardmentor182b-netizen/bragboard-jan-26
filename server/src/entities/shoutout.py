from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.config import Base

class Shoutout(Base):
    __tablename__ = "shoutouts"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_shoutouts")
    recipients = relationship("ShoutoutRecipient", back_populates="shoutout")
    tags = relationship("ShoutoutTag", back_populates="shoutout")

class ShoutoutRecipient(Base):
    __tablename__ = "shoutout_recipients"
    
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    
    shoutout = relationship("Shoutout", back_populates="recipients")
    recipient = relationship("User", back_populates="received_shoutouts")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    shoutouts = relationship("ShoutoutTag", back_populates="tag")

class ShoutoutTag(Base):
    __tablename__ = "shoutout_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    tag_id = Column(Integer, ForeignKey("tags.id"))
    
    shoutout = relationship("Shoutout", back_populates="tags")
    tag = relationship("Tag", back_populates="shoutouts")
