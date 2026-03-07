import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Get the directory where THIS file (core.py) is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. Go up two levels (out of 'database', out of 'src') to reach the 'server' folder
# Then create the database file there.
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "bragboard.db"))

# 3. Use the absolute path for the connection URL
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"📡 Database is connected at: {DB_PATH}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()