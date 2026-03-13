from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.core import Base

class Shoutout(Base):
    __tablename__ = "shoutout"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 1. This must be an Integer to match User.id
    receiver = Column(Integer, ForeignKey("user.id")) 

    # 2. This allows you to do 'shoutout.receiver_user.name'
    receiver_user = relationship("User", backref="received_shoutouts")

    # 3. KEEP THIS COMMENTED UNTIL REPORT TABLE IS FIXED
    # reports = relationship("Report", back_populates="shoutout")