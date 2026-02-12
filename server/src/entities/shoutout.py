"""
Shoutout Entity Model
Database model for shoutouts/recognitions
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from src.database.connection import Base


class VisibilityEnum(str, enum.Enum):
    """Visibility levels for shoutouts"""
    PUBLIC = "public"
    TEAM = "team"
    PRIVATE = "private"


class Shoutout(Base):
    """
    Shoutout model for recognizing team members
    
    Attributes:
        id: Primary key
        content: The shoutout message/content
        author_id: User who created the shoutout
        recipient_name: Person being recognized (optional)
        visibility: Who can see this shoutout
        created_at: Timestamp when created
        updated_at: Timestamp when last modified
        is_deleted: Soft delete flag
    """
    __tablename__ = "shoutouts"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_name = Column(String(255), nullable=True)
    visibility = Column(
        SQLEnum(VisibilityEnum),
        nullable=False,
        default=VisibilityEnum.PUBLIC
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    is_deleted = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="shoutouts")
    # comments = relationship("Comment", back_populates="shoutout", cascade="all, delete-orphan")
    # reactions = relationship("Reaction", back_populates="shoutout", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Shoutout(id={self.id}, author_id={self.author_id}, recipient='{self.recipient_name}')>"

