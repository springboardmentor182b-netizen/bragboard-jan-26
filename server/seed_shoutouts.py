import sys
import os

# Add the current directory to sys.path to allow imports from src
sys.path.append(os.getcwd())

from src.core.database import SessionLocal
from src.entities.shoutout import Shoutout

def seed_shoutouts():
    db = SessionLocal()
    # Check if empty
    if db.query(Shoutout).count() == 0:
        print("Seeding shoutouts...")
        samples = [
            Shoutout(sender_id=1, receiver_id=2, message="Great job on the presentation!"),
            Shoutout(sender_id=2, receiver_id=1, message="Thanks for the help with the DB setup."),
            Shoutout(sender_id=1, receiver_id=2, message="Loving the new UI designs. Keep it up!")
        ]
        db.add_all(samples)
        db.commit()
        print("Done.")
    else:
        print("Shoutouts already exist.")
    db.close()

if __name__ == "__main__":
    seed_shoutouts()
