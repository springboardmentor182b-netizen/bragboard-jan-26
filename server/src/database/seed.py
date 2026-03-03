import sys
import os

# Add server directory to python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

from src.database.database import SessionLocal, engine, Base
from src.entities.models import User

def seed_users():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if users exist
    if db.query(User).count() > 0:
        print("Users already exist. Skipping seed.")
        return

    users = [
        User(id=1, username="johndoe", email="john@example.com", full_name="John Doe", role="employee"),
        User(id=2, username="alice", email="alice@example.com", full_name="Alice Smith", role="employee"),
        User(id=3, username="bob", email="bob@example.com", full_name="Bob Jones", role="employee"),
    ]

    db.add_all(users)
    db.commit()
    print("Seeded 3 users successfully!")
    db.close()

if __name__ == "__main__":
    seed_users()
