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
