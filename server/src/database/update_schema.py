import sqlite3
import os

# Database path
db_path = os.path.join(os.path.dirname(__file__), '../../bragboard.db')

def update_schema():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # List of columns to add
    columns_to_add = [
        ("profile_picture", "VARCHAR NULL"),
        ("job_title", "VARCHAR DEFAULT 'Team Member'"),
        ("department", "VARCHAR DEFAULT 'General'")
    ]

    print("Checking and updating schema...")
    
    # Get existing columns
    cursor.execute("PRAGMA table_info(users)")
    existing_columns = [row[1] for row in cursor.fetchall()]

    for col_name, col_def in columns_to_add:
        if col_name not in existing_columns:
            try:
                print(f"Adding column '{col_name}'...")
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column '{col_name}' already exists.")

    conn.commit()
    conn.close()
    print("Schema update complete.")

if __name__ == "__main__":
    update_schema()
