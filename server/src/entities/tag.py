from sqlalchemy import Column, Integer, String
from src.database.core import Base

class Tag(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
