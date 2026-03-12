from src.database.database import engine
from sqlalchemy import text

def test_conn():
    try:
        print("Testing connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print(f"Result: {result.fetchone()}")
            print("Connection successful!")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_conn()
