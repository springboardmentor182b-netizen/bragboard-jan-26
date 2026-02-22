def update_profile():
    username = input("Enter username: ")

    cursor.execute("SELECT * FROM employees WHERE username = ?", (username,))
    user = cursor.fetchone()

    if user:
        name = input("Enter new name: ")
        email = input("Enter new email: ")
        department = input("Enter new department: ")
        designation = input("Enter new designation: ")

        cursor.execute("UPDATE employees SET name = ?, email = ?, department = ?, designation = ? WHERE username = ?", (name, email, department, designation, username))
        conn.commit()
        print("Profile updated successfully!")
    else:
        print("User not found")
