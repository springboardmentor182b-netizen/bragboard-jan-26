#!/usr/bin/env python3
"""
Database Migration: Add User Approval Columns
==============================================

This migration adds the approval workflow columns to the users table.
These columns enable admin approval for new user registrations.

Columns Added:
- status: ENUM ('pending', 'approved', 'rejected', 'suspended')
- approved_at: TIMESTAMP (when user was approved)
- approved_by: INTEGER (admin user_id who approved)
- rejection_reason: TEXT (optional reason for rejection)

Usage:
    python migrate_add_approval.py

IMPORTANT: Run this ONCE after pulling the latest code.
"""

from sqlalchemy import create_engine, text
from src.database.config import settings


def migrate():
    """Execute the migration"""
    engine = create_engine(settings.DATABASE_URL)
    
    print("\n" + "="*70)
    print("BragBoard - User Approval Migration")
    print("="*70)
    print(f"Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'local'}")
    print()
    
    with engine.connect() as conn:
        # Check if migration already ran
        print("🔍 Checking if migration is needed...")
        check = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='status'
        """))
        
        if check.fetchone():
            print("✓ Migration already completed!")
            print("  The approval columns already exist in the database.")
            print()
            return
        
        print("✓ Migration needed - approval columns not found")
        print()
        
        # Create ENUM type
        print("📝 Step 1: Creating userstatus ENUM type...")
        try:
            conn.execute(text("""
                CREATE TYPE userstatus AS ENUM (
                    'pending', 
                    'approved', 
                    'rejected', 
                    'suspended'
                )
            """))
            print("✅ Created userstatus ENUM type")
        except Exception as e:
            if "already exists" in str(e):
                print("✓ userstatus ENUM already exists, continuing...")
            else:
                raise
        
        print()
        print("📝 Step 2: Adding approval columns to users table...")
        
        # Add columns - existing users get 'approved' by default
        conn.execute(text("""
            ALTER TABLE users 
            ADD COLUMN status userstatus DEFAULT 'approved' NOT NULL,
            ADD COLUMN approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN approved_by INTEGER REFERENCES users(id),
            ADD COLUMN rejection_reason TEXT
        """))
        
        conn.commit()
        
        print("✅ Added approval columns successfully!")
        print()
        print("="*70)
        print("✨ Migration Complete!")
        print("="*70)
        print()
        print("Summary of changes:")
        print("  ✓ Added: status column (userstatus ENUM)")
        print("  ✓ Added: approved_at column (TIMESTAMP)")
        print("  ✓ Added: approved_by column (INTEGER, references users)")
        print("  ✓ Added: rejection_reason column (TEXT)")
        print()
        print("⚠️  IMPORTANT NOTES:")
        print("  • All EXISTING users have been auto-approved (status='approved')")
        print("  • NEW registrations will have status='pending' by default")
        print("  • Pending users cannot login until approved by an admin")
        print("  • You need at least one admin to approve users")
        print()
        print("🔑 Creating First Admin:")
        print("  If you don't have an admin yet, run:")
        print("  UPDATE users SET role='admin', status='approved' WHERE email='your-email@company.com';")
        print()


def check_admin_exists(engine):
    """Helper to check if any admin exists"""
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM users 
            WHERE role = CAST('admin' AS userrole) 
            AND status = CAST('approved' AS userstatus)
        """))
        count = result.scalar()
        return count > 0


if __name__ == "__main__":
    try:
        migrate()
        
        # Check if admin exists
        engine = create_engine(settings.DATABASE_URL)
        if not check_admin_exists(engine):
            print("⚠️  WARNING: No approved admin found!")
            print()
            print("To create your first admin, run this SQL:")
            print("  psql -U postgres bragboard_db")
            print("  UPDATE users SET role='admin', status='approved' WHERE email='your-email';")
            print()
        
    except Exception as e:
        print()
        print("="*70)
        print("❌ Migration Failed!")
        print("="*70)
        print(f"Error: {e}")
        print()
        print("💡 Troubleshooting:")
        print("  1. Make sure PostgreSQL is running")
        print("  2. Check your DATABASE_URL in .env file")
        print("  3. Ensure you have database admin permissions")
        print("  4. Verify the users table exists (run create_tables.py first)")
        print()
        raise
