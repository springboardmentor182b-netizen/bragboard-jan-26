from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from src.database.core import Base
import enum

class RoleEnum(str, enum.Enum):
    employee = "employee"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.employee)
    joined_at = Column(TIMESTAMP(timezone=True), server_default=func.now())