from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Create database engine
engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all the database models
Base = declarative_base()

# Dependency function to get database session(for api routes)
def get_db():
    """
    Creates a new database session for each request
    and closes it when done (even if there's an error)
    """
    db = SessionLocal()
    try:
        yield db  # Provide the session to whoever called this function
    finally:
        db.close()   