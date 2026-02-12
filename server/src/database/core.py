from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use SQLite for local development, or switch to your PostgreSQL URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./bragboard.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the database session for your controllers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()