from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from src.database.core import Base

class Shoutout(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String)
    receiver = Column(String)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)