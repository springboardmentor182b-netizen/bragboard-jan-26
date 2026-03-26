from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.connection import Base


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
    
    password_hash = Column(String, nullable=False)
    dob = Column(String, nullable=True) # Storing as string for simplicity, can use Date
    work = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)

    # Relationships
    sent_shoutouts = relationship("ShoutOut", back_populates="sender", foreign_keys="[ShoutOut.sender_id]")
    received_shoutouts = relationship("ShoutOut", back_populates="recipient", foreign_keys="[ShoutOut.recipient_id]")
    security_questions = relationship("SecurityQuestion", back_populates="user", cascade="all, delete-orphan")

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

class SecurityQuestion(Base):
    __tablename__ = "security_questions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question = Column(String)
    answer_hash = Column(String)

    user = relationship("User", back_populates="security_questions")

# Alias for backward compatibility — use ShoutOut (defined above) as the canonical model
Shoutout = ShoutOut