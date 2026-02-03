from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from src.database.connection import Base

class UserRole(str, enum.Enum):
    employee = "employee"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String)
    role = Column(SQLEnum(UserRole), default=UserRole.employee)
    joined_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    sent_shoutouts = relationship("ShoutOut", foreign_keys="ShoutOut.sender_id", back_populates="sender")
    received_shoutouts = relationship("ShoutOutRecipient", back_populates="recipient")