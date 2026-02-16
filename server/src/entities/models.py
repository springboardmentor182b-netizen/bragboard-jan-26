from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="employee") # employee, admin
    
    profile_picture = Column(String, nullable=True)
    job_title = Column(String, default="Team Member")
    department = Column(String, default="General")

    # Relationships
    sent_shoutouts = relationship("ShoutOut", back_populates="sender", foreign_keys="[ShoutOut.sender_id]")
    received_shoutouts = relationship("ShoutOut", back_populates="recipient", foreign_keys="[ShoutOut.recipient_id]")

class ShoutOut(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Storing reactions as a JSON payload for simplicity: {"like": 10, "love": 5}
    reactions = Column(JSON, default={})
    
    # Deprecated JSON column in favor of relation
    # comments = Column(JSON, default=[])

    tags = Column(JSON, default=[]) # List of tags/skills

    sender = relationship("User", back_populates="sent_shoutouts", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="received_shoutouts", foreign_keys=[recipient_id])

    comments = relationship("Comment", back_populates="shoutout", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="shoutout", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    shoutout = relationship("ShoutOut", back_populates="comments")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reason = Column(String)
    details = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    shoutout = relationship("ShoutOut", back_populates="reports")

