from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.connection import Base
import enum

class UserRole(str, enum.Enum):
    employee = "employee"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    department = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.employee, nullable=False)
    joined_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    sent_shoutouts = relationship("ShoutOut", back_populates="sender", foreign_keys="ShoutOut.sender_id")
    comments = relationship("Comment", back_populates="user")
    reactions = relationship("Reaction", back_populates="user")
    received_shoutouts = relationship("ShoutOutRecipient", back_populates="recipient")
