import random
from datetime import datetime, timedelta
from src.database.database import SessionLocal, engine
from src.entities.models import User, Shoutout, Comment, Base

def seed_analytics():
    db = SessionLocal()
    try:
        # 1. Update existing users with departments
        users = db.query(User).all()
        departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR"]
        
        for i, user in enumerate(users):
            user.department = departments[i % len(departments)]
            if not user.full_name:
                user.full_name = f"User {user.id}"
        
        db.commit()
        
        # 2. Add some comments and reactions if missing
        shoutouts = db.query(Shoutout).all()
        for s in shoutouts:
            if not s.reactions:
                s.reactions = {"like": random.randint(5, 20), "love": random.randint(2, 10)}
            
            # Add a comment
            comment = Comment(
                content="Great work! 🚀",
                user_id=random.choice(users).id,
                shoutout_id=s.id,
                created_at=s.created_at + timedelta(hours=1)
            )
            db.add(comment)
        
        db.commit()
        print("Successfully seeded analytics data!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_analytics()
