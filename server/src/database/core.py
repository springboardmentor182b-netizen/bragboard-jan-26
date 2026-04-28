from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


def create_tables(engine):
    """Create all tables that inherit from Base."""
    Base.metadata.create_all(bind=engine)
