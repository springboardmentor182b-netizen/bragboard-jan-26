from sqlalchemy import Column, Integer, String
from src.database.core import Base

class User(Base):
    tablename = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="employee")  # employee or admin
