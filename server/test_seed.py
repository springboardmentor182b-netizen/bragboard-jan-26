from src.database.connection import SessionLocal
from src.entities.user import User, UserRole
from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.report import Report
from src.auth.service import hash_password as get_password_hash

def run():
    db = SessionLocal()
    admin = db.query(User).filter(User.role == UserRole.admin).first()
    if not admin:
        admin = User(name="Admin", email="admin@test.com", password=get_password_hash("password"), role=UserRole.admin, department="IT")
        db.add(admin)
        db.commit()

    user = db.query(User).filter(User.role == UserRole.employee).first()
    if not user:
        user = User(name="User", email="user@test.com", password=get_password_hash("password"), role=UserRole.employee, department="HR")
        db.add(user)
        db.commit()

    admin.password = get_password_hash("password")
    db.commit()

    shoutout = Shoutout(sender_id=user.id, message="This is a test offensive shoutout", tags="spam")
    db.add(shoutout)
    db.commit()

    db.add(ShoutoutRecipient(shoutout_id=shoutout.id, recipient_id=admin.id))

    report = Report(shoutout_id=shoutout.id, reported_by=admin.id, reason="Inappropriate content test")
    db.add(report)
    db.commit()

    print(f"Admin Email: {admin.email}")
    print("Password: password")

if __name__ == "__main__":
    run()
