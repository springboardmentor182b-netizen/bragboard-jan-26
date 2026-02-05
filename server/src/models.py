from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, ARRAY
from sqlalchemy.orm import relationship
from src.database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    department = Column(String)
    role = Column(String) # 'employee' or 'admin'
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

class Shoutout(Base):
    __tablename__ = "shoutouts"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    # We store tags like "Teamwork,Innovation" as a simple string for simplicity
    tags = Column(String, nullable=True) 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    sender = relationship("User", backref="sent_shoutouts")
    recipients = relationship("ShoutoutRecipient", back_populates="shoutout")
    reactions = relationship("Reaction", back_populates="shoutout")

class ShoutoutRecipient(Base):
    __tablename__ = "shoutout_recipients"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    
    shoutout = relationship("Shoutout", back_populates="recipients")
    recipient = relationship("User")

class Reaction(Base):
    __tablename__ = "reactions"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String) # 'like', 'clap', 'star'
    
    shoutout = relationship("Shoutout", back_populates="reactions")