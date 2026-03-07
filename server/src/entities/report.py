from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from src.database.core import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    # Changed to ForeignKey so it can link to Shoutouts
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    reason = Column(String)
    details = Column(Text, nullable=True)

    # Add this relationship
    shoutout = relationship("Shoutout", back_populates="reports")