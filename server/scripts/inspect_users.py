import sqlite3

db_path = 'bragboard.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get table info
cursor.execute("PRAGMA table_info(users)")
columns = cursor.fetchall()
print("Columns in 'users' table:")
for col in columns:
    print(col)

# See if there's any data
cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()
print("\nRows in 'users' table:")
for row in rows:
    print(row)

conn.close()
