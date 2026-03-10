import sqlite3

db_path = 'bragboard.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print(f"Tables: {cursor.fetchall()}")

conn.close()
