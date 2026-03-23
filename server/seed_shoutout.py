import sys
from pathlib import Path

# Path fix to see 'src'
current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

# 1. IMPORT engine and Base from your core database file
from src.database.core import SessionLocal, engine, Base
from src.entities.shoutout import Shoutout
from src.entities.report import Report 

def run_seed():
    # 2. CREATE THE TABLES FIRST
    # This ensures 'shoutouts' and 'reports' exist before we try to delete/add
    print("🛠️  Creating tables if they don't exist...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("🗑️  Cleaning up old shoutouts...")
        db.query(Shoutout).delete()
        
        print("🌱 Seeding new shoutouts for BragBoard...")
        shoutouts = [
            Shoutout(sender="Amjith", receiver="Team", content="Great job on the sprint!"),
            Shoutout(sender="Infosys_HR", receiver="Amjith", content="Welcome to the internship!"),
            Shoutout(sender="Alice", receiver="Bob", content="Thanks for helping with the React fix."),
            Shoutout(sender="Project_Lead", receiver="All", content="Demo day is coming up, let's go!")
        ]
        
        db.add_all(shoutouts)
        db.commit()
        print(f"✅ Successfully added {len(shoutouts)} shoutouts.")
        
    except Exception as e:
        print(f"❌ Error while seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()