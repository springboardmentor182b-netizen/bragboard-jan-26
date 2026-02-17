from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.database.core import Base

class Reaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # like, clap, star
    shoutout_id = Column(Integer, ForeignKey("shoutout.id"))
    user_id = Column(Integer, ForeignKey("user.id"))

    shoutout = relationship("Shoutout", back_populates="reactions")
    user = relationship("User")
