"""
Database Migration Script: Add User Approval Workflow
=======================================================

This script adds the following columns to the 'users' table:
- status (ENUM: pending, approved, rejected, suspended)
- approved_by (FK to users.id)
- approved_at (TIMESTAMP)
- rejection_reason (VARCHAR)

IMPORTANT: Run this BEFORE restarting the server with updated code!

Usage:
    python migrate_add_approval_status.py
"""

from sqlalchemy import text
from src.database.connection import engine
from src.entities.user import UserStatus


def run_migration():
    """Execute the migration to add approval workflow columns"""
    
    print("="*70)
    print("DATABASE MIGRATION: Adding User Approval Workflow")
    print("="*70)
    print()
    
    with engine.connect() as conn:
        try:
            # Step 1: Create the UserStatus ENUM type if it doesn't exist
            print("Step 1: Creating UserStatus ENUM type...")
            conn.execute(text("""
                DO $$ BEGIN
                    CREATE TYPE userstatus AS ENUM ('pending', 'approved', 'rejected', 'suspended');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
            """))
            conn.commit()
            print("✅ ENUM type created/verified")
            print()
            
            # Step 2: Add status column (default to 'approved' for existing users)
            print("Step 2: Adding 'status' column...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS status userstatus DEFAULT 'approved' NOT NULL;
            """))
            conn.commit()
            print("✅ Status column added")
            print()
            
            # Step 3: Add approved_by column (nullable FK)
            print("Step 3: Adding 'approved_by' column...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
            """))
            conn.commit()
            print("✅ Approved_by column added")
            print()
            
            # Step 4: Add approved_at column
            print("Step 4: Adding 'approved_at' column...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
            """))
            conn.commit()
            print("✅ Approved_at column added")
            print()
            
            # Step 5: Add rejection_reason column
            print("Step 5: Adding 'rejection_reason' column...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR;
            """))
            conn.commit()
            print("✅ Rejection_reason column added")
            print()
            
            # Step 6: Set existing users to 'approved' and set their approved_at
            print("Step 6: Setting existing users as 'approved'...")
            result = conn.execute(text("""
                UPDATE users 
                SET status = 'approved',
                    approved_at = joined_at
                WHERE status IS NULL OR approved_at IS NULL;
            """))
            conn.commit()
            affected_rows = result.rowcount
            print(f"✅ Updated {affected_rows} existing users to 'approved' status")
            print()
            
            print("="*70)
            print("MIGRATION COMPLETED SUCCESSFULLY!")
            print("="*70)
            print()
            print("Next Steps:")
            print("1. ✅ Migration complete - new columns added")
            print("2. 🔄 Restart your FastAPI server")
            print("3. 🔐 Create an admin user if you don't have one:")
            print("   python create_admin.py")
            print("4. 🎉 New registrations will now require admin approval!")
            print()
            
        except Exception as e:
            print()
            print("="*70)
            print("❌ MIGRATION FAILED!")
            print("="*70)
            print(f"Error: {str(e)}")
            print()
            print("Troubleshooting:")
            print("- Make sure PostgreSQL is running")
            print("- Check your DATABASE_URL in .env file")
            print("- Verify you have the correct database permissions")
            print()
            conn.rollback()
            raise


if __name__ == "__main__":
    try:
        run_migration()
    except Exception as e:
        print(f"\n❌ Migration failed with error: {str(e)}")
        exit(1)
