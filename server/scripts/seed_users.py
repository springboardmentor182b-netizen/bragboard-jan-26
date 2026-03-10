import sys
import os

# Add the current directory to sys.path to allow imports from src
sys.path.append(os.getcwd())

from src.core.database import SessionLocal, engine, Base
from src.users.models import User
from src.core.security import hash_password

def seed_users():
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).count() == 0:
            print("Seeding initial users...")
            admin = User(
                email="admin@bragboard.com",
                password=hash_password("admin123"),
                role="admin",
                full_name="Admin Manager",
                job_title="System Administrator"
            )
            employee = User(
                email="employee@test.com",
                password=hash_password("employee123"),
                role="employee",
                full_name="Employee One",
                job_title="Product Designer"
            )

            db.add(admin)
            db.add(employee)
            db.commit()
            print("Initial users seeded successfully.")
        else:
            print("Users already exist in the database.")
    except Exception as e:
        print(f"Error seeding users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
