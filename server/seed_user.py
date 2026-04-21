from src.database.core import SessionLocal, engine, Base
from src.entities.user import User

# Create the tables in the database
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if we already have users
if db.query(User).count() == 0:
    test_users = [
        User(name="Amjith Khan", email="amjith@infosys.com", department="Engineering", role="admin", status="active"),
        User(name="Afra Bano", email="afra@infosys.com", department="Development", role="employee", status="active"),
        User(name="John Doe", email="john@example.com", department="HR", role="employee", status="active"),
    ]
    db.add_all(test_users)
    db.commit()
    print("✅ Sample users added successfully!")
else:
    print("Users already exist in database.")

db.close()