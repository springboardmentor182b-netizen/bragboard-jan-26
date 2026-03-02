def forgot_password():
    username = input("Enter username: ")
    email = input("Enter email: ")

    cursor.execute("SELECT * FROM employees WHERE username = ? AND email = ?", (username, email))
    user = cursor.fetchone()

    if user:
        # Generate a random password reset token
        token = secrets.token_urlsafe(16)
        cursor.execute("UPDATE employees SET password_reset_token = ? WHERE username = ?", (token, username))
        conn.commit()

        # Send email with password reset link
        print("Password reset link sent to your email!")
    else:
        print("Invalid username or email")
