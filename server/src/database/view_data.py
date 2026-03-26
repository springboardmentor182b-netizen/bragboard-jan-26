import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to the database
db_url = os.getenv("DATABASE_URL")
print(f"--- Database: {db_url} ---\n")

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()

    print("--- Users ---")
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    if not users:
        print("No users found.")
    else:
        # Get column names
        names = [desc[0] for desc in cursor.description]
        print(f"{names}")
        for user in users:
            print(user)
    
    print("\n" + "="*30 + "\n")

    print("--- ShoutOuts ---")
    cursor.execute("SELECT * FROM shoutouts")
    shoutouts = cursor.fetchall()
    if not shoutouts:
        print("No shoutouts found.")
    else:
        names = [desc[0] for desc in cursor.description]
        print(f"{names}")
        for shoutout in shoutouts:
            print(shoutout)

    conn.close()

except Exception as e:
    print(f"Error connecting to database: {e}")
