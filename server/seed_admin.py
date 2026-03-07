import sys
import os

# Ensure the 'server' directory is in the python path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database.core import engine, Base, SessionLocal
from src.entities.shoutout import Shoutout
from src.entities.report import Report

def seed_database():
    # 1. Create tables in the database file defined in core.py
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()

    try:
        # Check if we already have data to avoid duplicates
        existing_report = db.query(Report).first()
        if existing_report:
            print("⚠️ Database already contains data. Skipping seed.")
            return

        # 2. Add a Sample Shoutout
        sample_shoutout = Shoutout(
            sender="Alex Rivera",
            receiver="Team",
            content="The presentation was absolute garbage!"
        )
        db.add(sample_shoutout)
        db.commit()
        db.refresh(sample_shoutout)

        # 3. Add a Report linked to that Shoutout
        sample_report = Report(
            shoutout_id=sample_shoutout.id,
            reason="Inappropriate Language",
            details="Used a banned word in the second sentence."
        )
        db.add(sample_report)
        db.commit()

        print(f"✅ Success! Seeded 1 Report for Shoutout from: {sample_shoutout.sender}")

    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()