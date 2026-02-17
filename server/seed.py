"""
Seed Database with Sample Data
Run this script to populate database with test data
"""

from src.database.connection import SessionLocal, engine, Base
from src.users.models import User, UserRole
from src.users.service import UserService
from src.entities.models import ShoutOut, ShoutOutRecipient, Comment, Reaction, ReactionType
from datetime import datetime, timedelta

def create_sample_users(db):
    """Create sample users"""
    print("Creating sample users...")
    
    users_data = [
        {"name": "Sarah Johnson", "email": "sarah.johnson@company.com", "password": "password123", "department": "Engineering", "role": UserRole.ADMIN},
        {"name": "Mike Chen", "email": "mike.chen@company.com", "password": "password123", "department": "Product", "role": UserRole.MANAGER},
        {"name": "Emma Wilson", "email": "emma.wilson@company.com", "password": "password123", "department": "Marketing", "role": UserRole.EMPLOYEE},
        {"name": "Alex Kumar", "email": "alex.kumar@company.com", "password": "password123", "department": "Engineering", "role": UserRole.EMPLOYEE},
        {"name": "Lisa Park", "email": "lisa.park@company.com", "password": "password123", "department": "Design", "role": UserRole.EMPLOYEE},
        {"name": "David Lee", "email": "david.lee@company.com", "password": "password123", "department": "Sales", "role": UserRole.MANAGER},
        {"name": "Rachel Green", "email": "rachel.green@company.com", "password": "password123", "department": "HR", "role": UserRole.EMPLOYEE},
        {"name": "Tom Brady", "email": "tom.brady@company.com", "password": "password123", "department": "Engineering", "role": UserRole.EMPLOYEE},
        {"name": "Amy Wong", "email": "amy.wong@company.com", "password": "password123", "department": "Product", "role": UserRole.EMPLOYEE},
        {"name": "John Smith", "email": "john.smith@company.com", "password": "password123", "department": "Finance", "role": UserRole.MANAGER},
    ]
    
    users = []
    for user_data in users_data:
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
    
    return users

def create_sample_shoutouts(db, users):
    """Create sample shout-outs"""
    print("\nCreating sample shout-outs...")
    
    shoutouts_data = [
        {
            "sender": users[0],  # Sarah
            "recipients": [users[1], users[2]],  # Mike, Emma
            "message": "Amazing work on the Q4 product launch! Your dedication and creativity were outstanding."
        },
        {
            "sender": users[1],  # Mike
            "recipients": [users[3]],  # Alex
            "message": "Thank you for fixing that critical bug so quickly. Your technical expertise saved the day!"
        },
        {
            "sender": users[2],  # Emma
            "recipients": [users[4]],  # Lisa
            "message": "The new design system looks incredible! Great job on making our product more user-friendly."
        },
        {
            "sender": users[3],  # Alex
            "recipients": [users[0]],  # Sarah
            "message": "Huge thanks for your leadership during the migration. Your planning made everything smooth."
        },
        {
            "sender": users[4],  # Lisa
            "recipients": [users[1], users[2], users[3]],  # Mike, Emma, Alex
            "message": "Team effort on the redesign was phenomenal! Couldn't have done it without all of you."
        },
    ]
    
    shoutouts = []
    for i, data in enumerate(shoutouts_data):
        shoutout = ShoutOut(
            sender_id=data["sender"].id,
            message=data["message"],
            created_at=datetime.utcnow() - timedelta(days=5-i)  # Spread over 5 days
        )
        db.add(shoutout)
        db.flush()
        
        # Add recipients
        for recipient in data["recipients"]:
            recipient_entry = ShoutOutRecipient(
                shoutout_id=shoutout.id,
                recipient_id=recipient.id
            )
            db.add(recipient_entry)
        
        shoutouts.append(shoutout)
        print(f"  ✓ Created shout-out from {data['sender'].name}")
    
    db.commit()
    return shoutouts

def create_sample_comments(db, shoutouts, users):
    """Create sample comments"""
    print("\nCreating sample comments...")
    
    comments_data = [
        {"shoutout": shoutouts[0], "user": users[1], "content": "Thank you! It was a team effort."},
        {"shoutout": shoutouts[0], "user": users[2], "content": "Appreciate the recognition!"},
        {"shoutout": shoutouts[1], "user": users[3], "content": "Happy to help anytime!"},
        {"shoutout": shoutouts[2], "user": users[4], "content": "Thanks for the kind words!"},
        {"shoutout": shoutouts[3], "user": users[0], "content": "Great work everyone!"},
    ]
    
    for data in comments_data:
        comment = Comment(
            shoutout_id=data["shoutout"].id,
            user_id=data["user"].id,
            content=data["content"]
        )
        db.add(comment)
        print(f"  ✓ Created comment on shout-out #{data['shoutout'].id}")
    
    db.commit()

def create_sample_reactions(db, shoutouts, users):
    """Create sample reactions"""
    print("\nCreating sample reactions...")
    
    reaction_count = 0
    for shoutout in shoutouts:
        # Add some random reactions
        for user in users[:5]:  # First 5 users react
            reaction_type = [ReactionType.LIKE, ReactionType.CLAP, ReactionType.STAR][shoutout.id % 3]
            reaction = Reaction(
                shoutout_id=shoutout.id,
                user_id=user.id,
                type=reaction_type
            )
            db.add(reaction)
            reaction_count += 1
    
    db.commit()
    print(f"  ✓ Created {reaction_count} reactions")

def seed_database():
    """Main function to seed the database"""
    print("=" * 50)
    print("BragBoard Database Seeding")
    print("=" * 50)
    
    # Create tables
    print("\nCreating database tables...")
    Base.metadata.create_all(bind=engine)
    print("  ✓ Tables created")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if data already exists
        user_count = db.query(User).count()
        if user_count > 0:
            print("\n⚠ Database already contains data!")
            response = input("Do you want to clear and re-seed? (yes/no): ")
            if response.lower() != 'yes':
                print("Seeding cancelled.")
                return
            
            # Clear existing data
            print("\nClearing existing data...")
            db.query(Reaction).delete()
            db.query(Comment).delete()
            db.query(ShoutOutRecipient).delete()
            db.query(ShoutOut).delete()
            db.query(User).delete()
            db.commit()
            print("  ✓ Data cleared")
        
        # Create sample data
        users = create_sample_users(db)
        shoutouts = create_sample_shoutouts(db, users)
        create_sample_comments(db, shoutouts, users)
        create_sample_reactions(db, shoutouts, users)
        
        print("\n" + "=" * 50)
        print("✓ Database seeding completed successfully!")
        print("=" * 50)
        print(f"\nCreated:")
        print(f"  - {len(users)} users")
        print(f"  - {len(shoutouts)} shout-outs")
        print(f"  - Multiple comments and reactions")
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
