"""
Migration: Add image_url column to shoutouts table

IMPORTANT — Run this if your database was created BEFORE the image upload
feature was added. If you are starting fresh the column will be created
automatically by main.py on first startup.

Usage:
    cd server
    python migrate_add_image_url.py

Safe to run multiple times — uses IF NOT EXISTS.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from src.database.connection import engine
from sqlalchemy import text, inspect


def migrate():
    inspector = inspect(engine)
    columns = [col["name"] for col in inspector.get_columns("shoutouts")]

    if "image_url" in columns:
        print("✅ image_url column already exists — nothing to do.")
        return

    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE shoutouts ADD COLUMN image_url VARCHAR"))
        conn.commit()
        print("✅ image_url column added to shoutouts table successfully.")


if __name__ == "__main__":
    migrate()
