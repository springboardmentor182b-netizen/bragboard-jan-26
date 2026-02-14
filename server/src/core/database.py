from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Using SQLite (this creates a file named bragboard.db in your folder)
SQLALCHEMY_DATABASE_URL = "sqlite:///./bragboard.db"

# 2. Create the engine 
# Note: 'check_same_thread' is required ONLY for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Setup Session and Base
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()