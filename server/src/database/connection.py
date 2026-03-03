from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.database.config import settings

# Create database engine with connection pooling improvements
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=3600,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    FastAPI dependency that yields a database session.
    Creates a new database session for each request
    and closes it when done (even if there's an error).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
