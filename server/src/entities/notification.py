from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from src.database.connection import Base


class Notification(Base):
    """
    Notifications for user activities:
    - Shoutout received (someone shouted you out)
    - Tagged in shoutout (mentioned in a shoutout)
    - Reaction on your shoutout
    - Comment on your shoutout
    """
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Who receives this notification
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Notification type
    # Types: "shoutout_received", "shoutout_tagged", "reaction_added", "comment_added"
    type = Column(String, nullable=False)
    
    # Notification title (e.g., "You received a shoutout!")
    title = Column(String, nullable=False)
    
    # Notification message
    message = Column(Text, nullable=False)
    
    # Link/reference to the related resource
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=True)
    
    # Who triggered this notification
    from_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Read status
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    read_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="notifications")
    from_user = relationship("User", foreign_keys=[from_user_id])
    shoutout = relationship("Shoutout", foreign_keys=[shoutout_id])
