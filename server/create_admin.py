import sys
import os
from sqlalchemy.orm import Session

# Add the project root to sys.path
sys.path.append(os.getcwd())

from src.database.database import SessionLocal, engine, Base
from src.entities import models
from src.auth.utils import get_password_hash

def ensure_admin():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.email == "admin@test.com").first()
        if not admin:
            print("Creating admin user...")
            admin = models.User(
                email="admin@test.com",
                username="admin",
                full_name="System Admin",
                password_hash=get_password_hash("admin123"),
                role="admin",
                job_title="Administrator",
                department="IT"
            )
            db.add(admin)
            db.commit()
            print("Admin user created: admin@test.com / admin123")
        else:
            print("Admin user already exists.")
            if admin.role != "admin":
                admin.role = "admin"
                db.commit()
                print("Updated existing user to admin role.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    ensure_admin()
