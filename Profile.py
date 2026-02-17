def view_profile():
    username = input("Enter username: ")

    cursor.execute("SELECT * FROM employees WHERE username = ?", (username,))
    user = cursor.fetchone()

    if user:
        print("User Profile:")
        print(f"Name: {user[3]}")
        print(f"Email: {user[4]}")
        print(f"Department: {user[5]}")
        print(f"Designation: {user[6]}")
    else:
        print("User not found")
