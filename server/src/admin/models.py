from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.database.core import Base  # Ensure this path to Base is correct

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    # Relationship to shoutouts they sent
    shoutouts = relationship("Shoutout", back_populates="user")

class Shoutout(Base):
    __tablename__ = "shoutouts"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="shoutouts")
    reports = relationship("Report", back_populates="shoutout")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    reason = Column(String)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    
    shoutout = relationship("Shoutout", back_populates="reports")