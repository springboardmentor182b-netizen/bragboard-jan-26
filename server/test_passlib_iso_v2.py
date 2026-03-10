from src.auth.utils import pwd_context

def test_passlib():
    try:
        pw = "testpass123"
        print(f"Testing hashing of: '{pw}' (length: {len(pw)})")
        h = pwd_context.hash(pw)
        print(f"Hashed: {h[:20]}...")
        print("Success!")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test_passlib()
