from src.database.database import SessionLocal
from src.entities.models import User, Shoutout, Comment, Report

def test_counts():
    db = SessionLocal()
    try:
        users = db.query(User).count()
        shoutouts = db.query(Shoutout).count()
        comments = db.query(Comment).count()
        reports = db.query(Report).count()
        
        print("DATABASE VOLUME CHECK:")
        print(f"Total Users: {users}")
        print(f"Total Shout-Outs: {shoutouts}")
        print(f"Total Comments: {comments}")
        print(f"Total Reports: {reports}")
        
    finally:
        db.close()

if __name__ == "__main__":
    test_counts()
