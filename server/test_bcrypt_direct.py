import bcrypt

def test_bcrypt():
    try:
        password = b"testpassword"
        # Hash a password for the first time, with a randomly-generated salt
        print("1. Hashing...")
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        print(f"   Hashed: {hashed}")
        
        # Check that an unhashed password matches one that has previously been hashed
        print("2. Verifying...")
        if bcrypt.checkpw(password, hashed):
            print("   It matches!")
        else:
            print("   It does not match")
            
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test_bcrypt()
