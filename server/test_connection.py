import sys
import os

# Add the current directory to sys.path to allow imports from src
sys.path.append(os.getcwd())

from src.core.database import SessionLocal, engine, Base
from src.users.models import User
from sqlalchemy import text

def test_connection():
    try:
        # Try to connect and execute a simple query
        db = SessionLocal()
        result = db.execute(text("SELECT 1")).fetchone()
        print(f"Database connection successful: {result}")
        
        # Try to query the users table using the model
        users = db.query(User).all()
        print(f"Found {len(users)} users in the database.")
        for user in users:
            print(f"User: {user.email}, Role: {user.role}")
        
        db.close()
    except Exception as e:
        print(f"Database connection failed: {e}")

if __name__ == "__main__":
    test_connection()
