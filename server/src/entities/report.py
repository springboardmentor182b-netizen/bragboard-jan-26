from sqlalchemy import Column, Integer, String, Text
from src.database.core import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer)
    reason = Column(String)
    details = Column(Text, nullable=True)