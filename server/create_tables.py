"""
Script to create all database tables.
Run once to initialize your database schema.
"""

from src.database.connection import Base, engine

# Import ALL entities so SQLAlchemy knows about every table
from src.entities.user import User           # noqa: F401
from src.entities.shoutout import Shoutout, ShoutoutRecipient  # noqa: F401


def create_tables():
    print("Creating database tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("✓ Dropped existing tables")

        Base.metadata.create_all(bind=engine)
        print("✓ Tables created:")
        print("  - users")
        print("  - shoutouts")
        print("  - shoutout_recipients")

    except Exception as e:
        print(f"✗ Error: {e}")
        print("Make sure PostgreSQL is running and your .env file is configured.")


if __name__ == "__main__":
    create_tables()
