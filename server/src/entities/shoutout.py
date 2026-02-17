from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.core import Base

# Association table for many-to-many relationship between Shoutout and User (recipients)
shoutout_recipients = Table(
    'shoutout_recipients',
    Base.metadata,
    Column('shoutout_id', Integer, ForeignKey('shoutout.id')),
    Column('user_id', Integer, ForeignKey('user.id'))
)

# Association table for many-to-many relationship between Shoutout and Tag
shoutout_tags = Table(
    'shoutout_tags',
    Base.metadata,
    Column('shoutout_id', Integer, ForeignKey('shoutout.id')),
    Column('tag_id', Integer, ForeignKey('tag.id'))
)

class Shoutout(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sender_id = Column(Integer, ForeignKey("user.id"))
    
    sender = relationship("User", foreign_keys=[sender_id])
    recipients = relationship("User", secondary=shoutout_recipients)
    tags = relationship("Tag", secondary=shoutout_tags)
    comments = relationship("Comment", back_populates="shoutout")
    reactions = relationship("Reaction", back_populates="shoutout")
