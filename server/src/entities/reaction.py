from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.database.core import Base

class ShoutoutReaction(Base):
    __tablename__ = "shoutout_reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String) # 'thumbs_up', 'heart', 'star/clap'

    shoutout = relationship("Shoutout", back_populates="reactions")
    user = relationship("User")
