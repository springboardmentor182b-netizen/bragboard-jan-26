<<<<<<< HEAD
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from src.database.core import Base
=======
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from src.database.connection import Base
import datetime
import enum


class UserRole(enum.Enum):        # ← this is what's missing
    employee = "employee"
    admin = "admin"
>>>>>>> origin/main-group-D


class User(Base):
    __tablename__ = "users"

<<<<<<< HEAD
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    department = Column(String, nullable=True)
    role = Column(String, nullable=False, default="user")
    joined_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    security_question = Column(String, nullable=True)
    security_answer = Column(String, nullable=True)  # stored as bcrypt hash

    # Relationships
    sent_shoutouts = relationship("Shoutout", back_populates="sender")
    comments = relationship("Comment", back_populates="user")
    reactions = relationship("Reaction", back_populates="user")
    reports = relationship("Report", back_populates="reporter")
    admin_logs = relationship("AdminLog", back_populates="admin")
=======
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String)
    role = Column(Enum(UserRole), default=UserRole.employee)
    security_question = Column(String)
    security_answer = Column(String)
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)
>>>>>>> origin/main-group-D
