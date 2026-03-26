from src.database.connection import SessionLocal
from src.entities.models import User
db = SessionLocal()

# check if users already exist
existing = db.query(User).first()

if not existing:

    user1 = User(
        email="alex@company.com",
        password="123",
        name="Alex"
    )

    user2 = User(
        email="sara@company.com",
        password="123",
        name="Sara"
    )

    db.add(user1)
    db.add(user2)

    db.commit()

    print("Users added successfully!")

else:
    print("Users already exist.")

db.close()