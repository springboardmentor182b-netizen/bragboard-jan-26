def login_user():
    username = input("Enter username: ")
    password = getpass.getpass("Enter password: ")

    cursor.execute("SELECT * FROM employees WHERE username = ? AND password = ?", (username, hashlib.sha256(password.encode()).hexdigest()))
    user = cursor.fetchone()

    if user:
        print("Login successful!")
        # Redirect to dashboard or main page
    else:
        print("Invalid username or password")
