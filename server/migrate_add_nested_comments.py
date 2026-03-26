"""
Migration: Add parent_id to comments table for nested replies.

Run from the server/ directory:
    python migrate_add_nested_comments.py
"""
import os
import sys
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("❌ DATABASE_URL not set in .env")
    sys.exit(1)

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

print("Connecting to database...")
conn = psycopg2.connect(DATABASE_URL)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

print("Adding parent_id column to comments table...")

# Add parent_id column (safe — IF NOT EXISTS)
cur.execute("""
    ALTER TABLE comments
    ADD COLUMN IF NOT EXISTS parent_id INTEGER
    REFERENCES comments(id) ON DELETE CASCADE;
""")
print("  ✅ parent_id column added (or already existed)")

# Add index for fast lookup of replies by parent
cur.execute("""
    CREATE INDEX IF NOT EXISTS ix_comments_parent_id
    ON comments(parent_id);
""")
print("  ✅ Index on parent_id created (or already existed)")

cur.close()
conn.close()

print("\n✅ Migration complete — nested comments are now supported.")
print("   Existing comments are unaffected (parent_id defaults to NULL = top-level).")