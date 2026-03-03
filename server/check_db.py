
import sys
import os

# Add server directory to python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

from src.database.database import SessionLocal, engine, Base
from src.entities.models import User

def check_users():
    db = SessionLocal()
    users = db.query(User).all()
    with open('users_list.txt', 'w') as f:
        f.write(f"Total users: {len(users)}\n")
        for user in users:
            f.write(f"EMAIL: {user.email}\n")
            f.write(f"USERNAME: {user.username}\n")
            f.write("-" * 20 + "\n")
    db.close()

if __name__ == "__main__":
    check_users()
