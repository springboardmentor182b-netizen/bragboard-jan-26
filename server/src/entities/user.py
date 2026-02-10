from sqlalchemy import Column, Integer, String, DateTime
from src.database.core import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    department = Column(String)
    role = Column(String) # 'employee' or 'admin'
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)