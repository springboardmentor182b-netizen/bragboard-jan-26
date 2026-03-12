from src.database.database import SessionLocal, engine
from src.entities import models
from src.auth.utils import get_password_hash
from sqlalchemy import text

def simulate_signup():
    db = SessionLocal()
    try:
        print("1. Starting simulation...")
        # Check if user exists
        email = "test_sim@example.com"
        print(f"2. Checking if user {email} exists...")
        exists = db.query(models.User).filter(models.User.email == email).first()
        print(f"   Exists: {exists}")
        
        print("3. Hashing password...")
        pw_hash = get_password_hash("testpass123")
        print(f"   Hash: {pw_hash[:10]}...")
        
        print("4. Creating user object...")
        new_user = models.User(
            email=email,
            username="test_sim",
            full_name="Test Sim",
            password_hash=pw_hash,
            dob="1990-01-01",
            work="sim",
            company_name="simcorp",
            phone_number="123456789",
            job_title="Simulator",
            department="Testing"
        )
        db.add(new_user)
        print("5. Flushing...")
        db.flush()
        print(f"   New User ID: {new_user.id}")
        
        print("6. Hashing security answer...")
        ans_hash = get_password_hash("Answer")
        print(f"   Ans Hash: {ans_hash[:10]}...")
        
        print("7. Adding security question...")
        sq = models.SecurityQuestion(
            user_id=new_user.id,
            question="What is your mother's maiden name?",
            answer_hash=ans_hash
        )
        db.add(sq)
        
        print("8. Committing...")
        db.commit()
        print("9. Success!")
    except Exception as e:
        print(f"FAILED at step: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    simulate_signup()
