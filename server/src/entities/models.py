"""
Entities Models
Database models for shout-outs, comments, reactions, and reports
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from src.database.connection import Base

class ReactionType(str, enum.Enum):
    """Reaction type enumeration"""
    LIKE = "like"
    CLAP = "clap"
    STAR = "star"

class ShoutOut(Base):
    """Shout-out table model"""
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id])
    recipients = relationship("ShoutOutRecipient", back_populates="shoutout", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="shoutout", cascade="all, delete-orphan")
    reactions = relationship("Reaction", back_populates="shoutout", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="shoutout", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ShoutOut(id={self.id}, sender_id={self.sender_id})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ShoutOutRecipient(Base):
    """Shout-out recipients table (many-to-many relationship)"""
    __tablename__ = "shoutout_recipients"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    shoutout = relationship("ShoutOut", back_populates="recipients")
    recipient = relationship("User")
    
    def __repr__(self):
        return f"<ShoutOutRecipient(shoutout_id={self.shoutout_id}, recipient_id={self.recipient_id})>"

class Comment(Base):
    """Comments table model"""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shoutout = relationship("ShoutOut", back_populates="comments")
    user = relationship("User")
    
    def __repr__(self):
        return f"<Comment(id={self.id}, shoutout_id={self.shoutout_id})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "shoutout_id": self.shoutout_id,
            "user_id": self.user_id,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Reaction(Base):
    """Reactions table model"""
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(ReactionType), nullable=False)
    
    # Relationships
    shoutout = relationship("ShoutOut", back_populates="reactions")
    user = relationship("User")
    
    def __repr__(self):
        return f"<Reaction(id={self.id}, type={self.type})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "shoutout_id": self.shoutout_id,
            "user_id": self.user_id,
            "type": self.type.value
        }

class Report(Base):
    """Reports table model for flagged content"""
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shoutout = relationship("ShoutOut", back_populates="reports")
    reporter = relationship("User")
    
    def __repr__(self):
        return f"<Report(id={self.id}, shoutout_id={self.shoutout_id})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "shoutout_id": self.shoutout_id,
            "reported_by": self.reported_by,
            "reason": self.reason,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
