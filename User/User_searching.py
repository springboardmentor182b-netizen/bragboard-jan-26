def search_users():
    print("Search Users:")
    print("1. Search by Name")
    print("2. Search by Email")
    print("3. Search by Department")
    print("4. Search by Designation")
    choice = input("Enter your choice: ")

    if choice == "1":
        name = input("Enter name to search: ")
        cursor.execute("SELECT * FROM employees WHERE name LIKE ?", ('%' + name + '%',))
    elif choice == "2":
        email = input("Enter email to search: ")
        cursor.execute("SELECT * FROM employees WHERE email LIKE ?", ('%' + email + '%',))
    elif choice == "3":
        department = input("Enter department to search: ")
        cursor.execute("SELECT * FROM employees WHERE department LIKE ?", ('%' + department + '%',))
    elif choice == "4":
        designation = input("Enter designation to search: ")
        cursor.execute("SELECT * FROM employees WHERE designation LIKE ?", ('%' + designation + '%',))
    else:
        print("Invalid choice")
        return

    users = cursor.fetchall()
    if users:
        print("Search Results:")
        for user in users:
            print(f"ID: {user[0]}, Name: {user[3]}, Email: {user[4]}, Department: {user[5]}, Designation: {user[6]}")
    else:
        print("No users found")

def filter_users():
    print("Filter Users:")
    print("1. Filter by Department")
    print("2. Filter by Designation")
    print("3. Filter by Status")
    choice = input("Enter your choice: ")

    if choice == "1":
        department = input("Enter department to filter: ")
        cursor.execute("SELECT * FROM employees WHERE department = ?", (department,))
    elif choice == "2":
        designation = input("Enter designation to filter: ")
        cursor.execute("SELECT * FROM employees WHERE designation = ?", (designation,))
    elif choice == "3":
        status = input("Enter status to filter (Active/Inactive): ")
        cursor.execute("SELECT * FROM employees WHERE status = ?", (
