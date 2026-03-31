"""
Migration: Add reactions and comments tables

Run once on existing databases that were created before these features:
    cd server
    python migrate_add_reactions_comments.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from src.database.connection import Base, engine
from src.entities.reaction import Reaction   # noqa: F401
from src.entities.comment import Comment     # noqa: F401


def migrate():
    print("Creating 'reactions' and 'comments' tables if they don't exist...")
    Base.metadata.create_all(bind=engine, checkfirst=True)
    print("✅  Done.")


if __name__ == "__main__":
    migrate()
