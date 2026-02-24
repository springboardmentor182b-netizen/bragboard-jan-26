from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from src.database.core import Base


class User(Base):
    __tablename__ = "users"

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
