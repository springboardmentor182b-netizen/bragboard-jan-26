#!/usr/bin/env python3
"""
Database Migration: Add Notifications Table
===========================================

This migration adds the notifications table to support real-time notifications
for shoutouts, reactions, and comments.

Usage:
    python migrate_add_notifications.py

Run this ONCE after pulling the latest code.
"""

from sqlalchemy import create_engine, text
from src.database.config import settings


def migrate():
    """Execute the migration"""
    engine = create_engine(settings.DATABASE_URL)
    
    print("\n" + "="*70)
    print("BragBoard - Notifications Migration")
    print("="*70)
    print(f"Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'local'}")
    print()
    
    with engine.connect() as conn:
        # Check if migration already ran
        print("🔍 Checking if migration is needed...")
        check = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='notifications'
        """))
        
        if check.fetchone():
            print("✓ Migration already completed!")
            print("  The notifications table already exists in the database.")
            print()
            return
        
        print("✓ Migration needed - notifications table not found")
        print()
        
        # Create notifications table
        print("📝 Creating notifications table...")
        conn.execute(text("""
            CREATE TABLE notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR NOT NULL,
                title VARCHAR NOT NULL,
                message TEXT NOT NULL,
                shoutout_id INTEGER REFERENCES shoutouts(id) ON DELETE CASCADE,
                from_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                is_read BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                read_at TIMESTAMP
            )
        """))
        
        print("✅ Notifications table created!")
        print()
        
        # Create indexes for better performance
        print("📝 Creating indexes...")
        conn.execute(text("""
            CREATE INDEX idx_notifications_user_id ON notifications(user_id);
            CREATE INDEX idx_notifications_is_read ON notifications(is_read);
            CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
        """))
        
        print("✅ Indexes created!")
        print()
        
        conn.commit()
        
        print("="*70)
        print("✨ Migration Complete!")
        print("="*70)
        print()
        print("Summary of changes:")
        print("  ✓ Created: notifications table")
        print("  ✓ Created: indexes for user_id, is_read, created_at")
        print()
        print("Notification types supported:")
        print("  • shoutout_received - When you receive a shoutout")
        print("  • shoutout_tagged - When you're mentioned in a shoutout")
        print("  • reaction_added - When someone reacts to your shoutout")
        print("  • comment_added - When someone comments on your shoutout")
        print()
        print("Next steps:")
        print("  1. Restart server: uvicorn main:app --reload")
        print("  2. Test notifications by creating shoutouts!")
        print()


if __name__ == "__main__":
    try:
        migrate()
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
        print("  4. Verify the users and shoutouts tables exist")
        print()
        raise
