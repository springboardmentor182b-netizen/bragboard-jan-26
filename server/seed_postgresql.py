import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from src.database.database import SessionLocal, engine
from src.entities.models import User, Shoutout, Comment, Report, Base
from src.auth.utils import get_password_hash

def seed_massive_data():
    db = SessionLocal()
    try:
        print("Starting massive PostgreSQL seed...")
        
        # 1. GENERATE USERS (if they don't exist)
        departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", "Operations"]
        job_titles = ["Software Engineer", "Product Manager", "UI Designer", "Marketing Specialist", "Accound Manager", "HR Coordinator", "Analyst"]
        
        first_names = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"]
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]

        new_users = []
        for i in range(50):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            email = f"{fname.lower()}.{lname.lower()}{i}@company.com"
            
            # Check if exists
            if not db.query(User).filter(User.email == email).first():
                user = User(
                    email=email,
                    username=f"{fname.lower()}{lname.lower()}{i}",
                    full_name=f"{fname} {lname}",
                    password_hash=get_password_hash("password123"),
                    role="employee",
                    department=random.choice(departments),
                    job_title=random.choice(job_titles)
                )
                db.add(user)
                new_users.append(user)
        
        db.commit()
        print(f"Added {len(new_users)} new users.")
        
        # Get all users for references
        all_users = db.query(User).all()
        user_ids = [u.id for u in all_users]

        # 2. GENERATE SHOUTOUTS
        shout_out_templates = [
            "Amazing work on the {project}! Really appreciate the hard work.",
            "Shout out to {name} for helping me with {task} today.",
            "Great presentation in the {meeting}! You crushed it.",
            "Thanks for the support during the {event} launch.",
            "You're a rockstar! {project} looks incredible.",
            "Exceptional problem solving on the {bug} issue.",
            "Big thanks to the team for the collaboration this week."
        ]
        projects = ["Apollo", "Zeus", "Hermes", "Q1 Goal", "Rebrand", "Landing Page"]
        tasks = ["refactoring", "debugging", "documentation", "testing"]
        meetings = ["All-Hands", "Stand-up", "Sprint Review"]
        events = ["Winter", "Product", "Global"]
        
        count = 0
        now = datetime.utcnow()
        for i in range(200):
            sender_id = random.choice(user_ids)
            recipient_id = random.choice([uid for uid in user_ids if uid != sender_id])
            
            template = random.choice(shout_out_templates)
            name = db.query(User).filter(User.id == recipient_id).first().full_name.split()[0]
            content = template.format(
                project=random.choice(projects),
                name=name,
                task=random.choice(tasks),
                meeting=random.choice(meetings),
                event=random.choice(events),
                bug="memory leak"
            )
            
            # Randomized timestamp within last 30 days
            days_ago = random.randint(0, 30)
            hours_ago = random.randint(0, 23)
            created_at = now - timedelta(days=days_ago, hours=hours_ago)
            
            shoutout = Shoutout(
                content=content,
                sender_id=sender_id,
                recipient_id=recipient_id,
                tags=[random.choice(["Teamwork", "Leadership", "Innovation", "Problem Support"])],
                reactions={"like": random.randint(0, 50), "love": random.randint(0, 20), "trophy": random.randint(0, 5)},
                created_at=created_at
            )
            db.add(shoutout)
            count += 1
            
            if i % 10 == 0:
                db.commit() # Intermittent commits
        
        db.commit()
        print(f"Generated {count} shout-outs across 30 days.")

        # 3. GENERATE COMMENTS
        shoutouts = db.query(Shoutout).all()
        shoutout_ids = [s.id for s in shoutouts]
        comment_templates = ["Totally agree!", "Well deserved!", "+1 to this!", "Great job!", "Keep it up!", "Awesome work!"]
        
        c_count = 0
        for i in range(100):
            sid = random.choice(shoutout_ids)
            uid = random.choice(user_ids)
            
            comment = Comment(
                content=random.choice(comment_templates),
                user_id=uid,
                shoutout_id=sid,
                created_at=now - timedelta(days=random.randint(0, 30))
            )
            db.add(comment)
            c_count += 1
        
        db.commit()
        print(f"Added {c_count} comments.")

        # 4. GENERATE REPORTS
        report_reasons = ["Spam or Misleading", "Inappropriate Content", "Harassment or Bullying", "Offensive Language"]
        r_count = 0
        for i in range(15):
            sid = random.choice(shoutout_ids)
            uid = random.choice(user_ids)
            
            report = Report(
                reason=random.choice(report_reasons),
                details="This seems like a test report or automated content.",
                user_id=uid,
                shoutout_id=sid,
                created_at=now - timedelta(days=random.randint(0, 5))
            )
            db.add(report)
            r_count += 1
            
        db.commit()
        print(f"Generated {r_count} reports for moderation testing.")
        
        print("MASSIVE SEED COMPLETE SUCCESS!")

    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_massive_data()
