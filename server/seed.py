from sqlalchemy.orm import Session
from src.database.database import SessionLocal, engine
from src.entities import models

def seed_data():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(models.User).first():
        print("Data already exists. Skipping seed.")
        db.close()
        return

    print("Seeding data...")

    # Create Users
    user1 = models.User(
        email="jane@example.com",
        username="jane_doe",
        full_name="Jane Doe",
        role="admin",
        job_title="Engineering Manager",
        department="Engineering",
        profile_picture="https://ui-avatars.com/api/?name=Jane+Doe&background=random"
    )
    
    user2 = models.User(
        email="john@example.com",
        username="john_smith",
        full_name="John Smith",
        role="employee",
        job_title="Software Engineer",
        department="Engineering",
        profile_picture="https://ui-avatars.com/api/?name=John+Smith&background=random"
    )

    user3 = models.User(
        email="alex@example.com",
        username="alex_jones",
        full_name="Alex Jones",
        role="employee",
        job_title="Product Designer",
        department="Design",
        profile_picture="https://ui-avatars.com/api/?name=Alex+Jones&background=random"
    )

    db.add(user1)
    db.add(user2)
    db.add(user3)
    db.commit()
    
    # Refresh to get IDs
    db.refresh(user1)
    db.refresh(user2)
    db.refresh(user3)

    # Create ShoutOuts
    shoutout1 = models.ShoutOut(
        content="Great work on the backend migration! The new database setup is blazing fast.",
        sender_id=user1.id,
        recipient_id=user2.id,
        tags=["Backend", "Performance"],
        reactions={"🔥": 5, "🚀": 3}
    )

    shoutout2 = models.ShoutOut(
        content="Thanks for the help with the Figma designs. They look amazing!",
        sender_id=user2.id,
        recipient_id=user3.id,
        tags=["Design", "Collaboration"],
        reactions={"❤️": 2}
    )

    db.add(shoutout1)
    db.add(shoutout2)
    db.commit()

    print("Seeding complete!")
    print(f"Created users: {user1.email}, {user2.email}, {user3.email}")
    db.close()

if __name__ == "__main__":
    seed_data()
