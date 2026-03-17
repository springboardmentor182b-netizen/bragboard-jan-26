"""
Entities Models
Database models for shout-outs, comments, reactions, and reports
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from src.database.config import Base

class ReactionType(str, enum.Enum):
    """Reaction type enumeration"""
    LIKE = "like"
    CLAP = "clap"
    STAR = "star"

class Shoutout(Base):
    """Shout-out table model"""
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_shoutouts")
    recipients = relationship("ShoutoutRecipient", back_populates="shoutout", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="shoutout", cascade="all, delete-orphan")
    reactions = relationship("Reaction", back_populates="shoutout", cascade="all, delete-orphan")
    tags = relationship("ShoutoutTag", back_populates="shoutout")
    
    def __repr__(self):
        return f"<Shoutout(id={self.id}, sender_id={self.sender_id})>"

class ShoutoutRecipient(Base):
    """Shout-out recipients table (many-to-many relationship)"""
    __tablename__ = "shoutout_recipients"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    shoutout = relationship("Shoutout", back_populates="recipients")
    recipient = relationship("User", foreign_keys=[recipient_id])
    
    def __repr__(self):
        return f"<ShoutoutRecipient(shoutout_id={self.shoutout_id}, recipient_id={self.recipient_id})>"

class Comment(Base):
    """Comments table model"""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shoutout = relationship("Shoutout", back_populates="comments")
    user = relationship("User", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<Comment(id={self.id}, shoutout_id={self.shoutout_id})>"

class Reaction(Base):
    """Reactions table model"""
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(ReactionType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shoutout = relationship("Shoutout", back_populates="reactions")
    user = relationship("User", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<Reaction(id={self.id}, type={self.type})>"

class ShoutoutTag(Base):
    """Shout-out tags junction table"""
    __tablename__ = "shoutout_tags"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
    
    # Relationships
    shoutout = relationship("Shoutout", back_populates="tags")
    tag = relationship("Tag", back_populates="shoutouts")

class Tag(Base):
    """Tags table model"""
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    
    # Relationships
    shoutouts = relationship("ShoutoutTag", back_populates="tag")
    
    def __repr__(self):
        return f"<Tag(id={self.id}, name={self.name})>"
