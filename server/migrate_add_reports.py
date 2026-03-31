"""
Migration: Add reports table

Run this script once to add the 'reports' table if you're upgrading from a
database that was created before the reporting feature was added.

Usage:
    cd server
    python migrate_add_reports.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.database.connection import Base, engine
from src.entities.report import Report  # noqa: F401 — registers Report with Base


def migrate():
    print("Creating 'reports' table if it does not exist...")
    # create_all with checkfirst=True will only create missing tables
    Base.metadata.create_all(bind=engine, checkfirst=True)
    print("Done. 'reports' table is ready.")


if __name__ == "__main__":
    migrate()
