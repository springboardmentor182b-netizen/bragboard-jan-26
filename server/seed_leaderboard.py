from sqlalchemy.orm import Session
from src.database.core import SessionLocal
from src.entities.user import User
from src.entities.shoutout import Shoutout

def seed_data():
    db = SessionLocal()
    try:
        # 1. Clear old test data so we start fresh
        db.query(Shoutout).delete()
        db.query(User).delete()
        db.commit()

        # 2. Create Users
        alice = User(name="Alice Johnson", email="alice@example.com")
        bob = User(name="Bob Smith", email="bob@example.com")
        charlie = User(name="Charlie Brown", email="charlie@example.com")

        db.add_all([alice, bob, charlie])
        db.commit() # This saves them and generates their IDs (1, 2, 3)

        # 3. Create Shoutouts (Giving them different scores)
        # Alice gets 3, Bob gets 1, Charlie gets 0
        data = [
            Shoutout(sender="Boss", content="Great job!", receiver=alice.id),
            Shoutout(sender="Colleague", content="Helpful as always", receiver=alice.id),
            Shoutout(sender="Client", content="Amazing result", receiver=alice.id),
            Shoutout(sender="Alice", content="Thanks for the tip", receiver=bob.id),
        ]

        db.add_all(data)
        db.commit()
        print("✅ Success! Database populated.")
        print(f"Alice ID: {alice.id}, Bob ID: {bob.id}")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()