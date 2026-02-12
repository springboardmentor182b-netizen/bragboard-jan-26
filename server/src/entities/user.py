from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database.connection import Base
import enum

# Define the role types as an Enum
class UserRole(str, enum.Enum):
    employee = "employee"
    admin = "admin"

# User table definition
class User(Base):
    """
    Represents the Users table in the database
    """
    __tablename__ = "users"  # Name of the table in PostgreSQL
    
    # Primary key - unique ID for each user
    id = Column(Integer, primary_key=True, index=True)
    
    # User information
    name = Column(String, nullable=False)  # Can't be empty
    email = Column(String, unique=True, nullable=False, index=True)  # Must be unique
    password = Column(String, nullable=False)  # Will store hashed password
    department = Column(String, nullable=False)
    
    # User role - either 'employee' or 'admin'
    role = Column(Enum(UserRole), default=UserRole.employee, nullable=False)
    
    # Security question for password reset
    security_question = Column(String, nullable=True)
    security_answer = Column(String, nullable=True)  # Will be hashed like password
    
    # Timestamp - automatically set when user is created
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    shoutouts = relationship("Shoutout", back_populates="author")
    
    def __repr__(self):
        """String representation of User object (for debugging)"""
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"