from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Force SQLite for development - PostgreSQL will be used only if explicitly configured
database_url = os.getenv("DATABASE_URL", "sqlite:///./bragboard.db")

# If it's PostgreSQL but we can't connect, fall back to SQLite
if "postgresql" in database_url:
    try:
        # Test PostgreSQL connection
        from sqlalchemy import create_engine as test_engine
        test_engine(database_url).connect()
    except:
        print("Warning: PostgreSQL connection failed, falling back to SQLite")
        database_url = "sqlite:///./bragboard.db"

# Create engine with SQLite specific settings
if "sqlite" in database_url:
    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False}  # Needed for SQLite
    )
else:
    engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
