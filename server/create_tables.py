"""
Script to create all database tables
Run this once to initialize your database schema
"""

from src.database.connection import Base, engine
from src.entities.user import User
from src.entities.shoutout import Shoutout

def create_tables():
    """
    Creates all tables defined in our models
    This reads all classes that inherit from Base
    and creates corresponding tables in PostgreSQL
    """
    print("Creating database tables...")
    
    try:
        # Drop all existing tables first (CAUTION: This deletes all data!)
        Base.metadata.drop_all(bind=engine)
        print("✓ Dropped existing tables")
        
        # Create all tables fresh
        Base.metadata.create_all(bind=engine)
        print("✓ Tables created successfully!")
        print("✓ Users table is ready")
        print("✓ Shoutouts table is ready")
        
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        print("Make sure PostgreSQL is running and your .env file is configured correctly")

if __name__ == "__main__":
    create_tables()