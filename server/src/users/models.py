from sqlalchemy import Column, Integer, String, Boolean
from src.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="employee")
    
    # Profile information
    full_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    shoutout_alerts = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)

