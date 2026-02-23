"""
Seed Database with Sample Data
Run this script to populate database with test data
"""

from src.database.connection import SessionLocal, engine, Base
from src.users.models import User, UserRole
from src.users.service import UserService

def create_sample_users(db):
    """Create sample users"""
    print("Creating sample users...")
    
    users_data = [
        {"name": "Sarah Johnson", "email": "sarah.johnson@company.com", "password": "password123", "department": "Engineering", "role": "admin"},
        {"name": "Mike Chen", "email": "mike.chen@company.com", "password": "password123", "department": "Product", "role": "manager"},
        {"name": "Emma Wilson", "email": "emma.wilson@company.com", "password": "password123", "department": "Marketing", "role": "employee"},
        {"name": "Alex Kumar", "email": "alex.kumar@company.com", "password": "password123", "department": "Engineering", "role": "employee"},
        {"name": "Lisa Park", "email": "lisa.park@company.com", "password": "password123", "department": "Design", "role": "employee"},
        {"name": "David Lee", "email": "david.lee@company.com", "password": "password123", "department": "Sales", "role": "manager"},
        {"name": "Rachel Green", "email": "rachel.green@company.com", "password": "password123", "department": "HR", "role": "employee"},
        {"name": "Tom Brady", "email": "tom.brady@company.com", "password": "password123", "department": "Engineering", "role": "employee"},
        {"name": "Amy Wong", "email": "amy.wong@company.com", "password": "password123", "department": "Product", "role": "employee"},
        {"name": "John Smith", "email": "john.smith@company.com", "password": "password123", "department": "Finance", "role": "manager"},
    ]
    
    users = []
    for user_data in users_data:
        try:
            user = UserService.create_user(
                db=db,
                name=user_data["name"],
                email=user_data["email"],
                password=user_data["password"],
                department=user_data["department"],
                role=user_data["role"]
            )
            users.append(user)
            print(f"  ✓ Created user: {user.name}")
        except Exception as e:
            print(f"  ✗ Error creating {user_data['name']}: {e}")
            continue
    
    return users

def seed_database():
    """Main function to seed the database"""
    print("=" * 50)
    print("BragBoard Database Seeding")
    print("=" * 50)
    
    print("\nCreating database tables...")
    Base.metadata.create_all(bind=engine)
    print("  ✓ Tables created")
    
    db = SessionLocal()
    
    try:
        user_count = db.query(User).count()
        if user_count > 0:
            print(f"\n⚠ Database already contains {user_count} users!")
            response = input("Do you want to clear and re-seed? (yes/no): ")
            if response.lower() != 'yes':
                print("Seeding cancelled.")
                return
            
            print("\nClearing existing data...")
            db.query(User).delete()
            db.commit()
            print("  ✓ Data cleared")
        
        users = create_sample_users(db)
        
        print("\n" + "=" * 50)
        print("✓ Database seeding completed successfully!")
        print("=" * 50)
        print(f"\nCreated:")
        print(f"  - {len(users)} users")
        print("\nYou can now log in with:")
        print("  Email: sarah.johnson@company.com")
        print("  Password: password123")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n✗ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
