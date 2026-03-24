"""
Migration: Add image_url column to shoutouts table

Run once on existing databases:
    cd server
    python migrate_add_image_url.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from src.database.connection import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE shoutouts ADD COLUMN IF NOT EXISTS image_url VARCHAR"))
            conn.commit()
            print("✅ image_url column added (or already existed).")
        except Exception as e:
            print(f"⚠️  Migration note: {e}")

if __name__ == "__main__":
    migrate()
