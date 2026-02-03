from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.connection import Base

class ShoutOut(Base):
    __tablename__ = "shoutouts"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_shoutouts")
    recipients = relationship("ShoutOutRecipient", back_populates="shoutout")
    reactions = relationship("Reaction", back_populates="shoutout")
    comments = relationship("Comment", back_populates="shoutout")

class ShoutOutRecipient(Base):
    __tablename__ = "shoutout_recipients"
    
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    
    shoutout = relationship("ShoutOut", back_populates="recipients")
    recipient = relationship("User", back_populates="received_shoutouts")