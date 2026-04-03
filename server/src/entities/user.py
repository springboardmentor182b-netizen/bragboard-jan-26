from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from src.database.core import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=True) # e.g., 'Engineering', 'HR'
    role = Column(String, default="employee")  # 'admin' or 'employee'
    status = Column(String, default="active")   # 'active' or 'inactive'
    joined_date = Column(DateTime, default=datetime.utcnow)