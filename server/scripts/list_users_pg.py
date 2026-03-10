import sys
import os

# Add the current directory to sys.path to allow imports from src
sys.path.append(os.getcwd())

from src.core.database import SessionLocal
from src.users.models import User

def list_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Total users found: {len(users)}")
        for u in users:
            print(f"ID: {u.id} | Email: {u.email} | Role: {u.role} | Name: {u.full_name}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
