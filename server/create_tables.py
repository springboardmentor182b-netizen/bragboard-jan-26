"""
Script to create all database tables
Run this once to initialize your database schema
"""
from src.entities.admin_log import AdminLog
from src.database.connection import Base, engine
from src.entities.user import User

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
        print("✓ Users table is ready with security question fields")
        
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        print("Make sure PostgreSQL is running and your password in config.py is correct")

if __name__ == "__main__":
    create_tables()
