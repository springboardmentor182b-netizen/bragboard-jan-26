import sqlite3
import os

# Connect to the database
# Assuming it is in the server root
db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'bragboard.db')

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print(f"--- Database: {db_path} ---\n")

try:
    print("--- Users ---")
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    if not users:
        print("No users found.")
    else:
        # Get column names
        names = [description[0] for description in cursor.description]
        print(f"{names}")
        for user in users:
            print(user)
except Exception as e:
    print(f"Error reading users: {e}")

print("\n" + "="*30 + "\n")

try:
    print("--- ShoutOuts ---")
    cursor.execute("SELECT * FROM shoutouts")
    shoutouts = cursor.fetchall()
    if not shoutouts:
        print("No shoutouts found.")
    else:
        names = [description[0] for description in cursor.description]
        print(f"{names}")
        for shoutout in shoutouts:
            print(shoutout)
except Exception as e:
    print(f"Error reading shoutouts: {e}")

conn.close()
