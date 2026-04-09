import sqlite3
import hashlib
import getpass
import secrets

# Connect to the database
conn = sqlite3.connect('employee.db')
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS employees
    (id INTEGER PRIMARY KEY, username TEXT, password TEXT, salt TEXT, name TEXT, email TEXT, department TEXT, designation TEXT, status TEXT)
''')

class Employee:
    def __init__(self, id, username, name, email, department, designation, status):
        self.id = id
        self.username = username
        self.name = name
        self.email = email
        self.department = department
        self.designation = designation
        self.status = status

def register_employee():
    username = input("Enter username: ")
    password = getpass.getpass("Enter password: ")
    name = input("Enter name: ")
    email = input("Enter email: ")
    department = input("Enter department: ")
    designation = input("Enter designation: ")

    # Generate a random salt
    salt = secrets.token_bytes(16)

    # Hash the password with the salt
    hashed_password = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)

    # Insert into database with pending status
    cursor.execute("INSERT INTO employees (username, password, salt, name, email, department, designation, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                   (username, hashed_password.hex(), salt.hex(), name, email, department, designation, "Pending"))
    conn.commit()
    print("Registration successful! Waiting for admin approval.")

def admin_approval():
    cursor.execute("SELECT * FROM employees WHERE status = 'Pending'")
    pending_employees = cursor.fetchall()
    if pending_employees:
        print("Pending Employee Registrations:")
        for employee in pending_employees:
            print(f"ID: {employee[0]}, Username: {employee[1]}, Name: {employee[4]}, Email: {employee[5]}")
        id = input("Enter ID to approve/reject: ")
        status = input("Enter status (Approved/Rejected): ")
        cursor.execute("UPDATE employees SET status = ? WHERE id = ?", (status, id))
        conn.commit()
        print("Employee registration updated successfully!")
    else:
        print("No pending registrations.")

def admin_login():
    admin_username = input("Enter admin username: ")
    admin_password = getpass.getpass("Enter admin password: ")

    # Load admin credentials from a secure file or database
    # For this example, we'll use hardcoded credentials
    admin_credentials = {
        'admin': '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8'
    }

    # Hash the input password
    hashed_password = hashlib.sha256(admin_password.encode()).hexdigest()

    if admin_username in admin_credentials and hashed_password == admin_credentials[admin_username]:
        return True
    else:
        return False

def main():
    while True:
        print("1. Register Employee")
        print("2. Admin Approval")
        print("3. Exit")
        choice = input("Enter your choice: ")

        if choice == "1":
            register_employee()
        elif choice == "2":
            if admin_login():
                admin_approval()
            else:
                print("Invalid admin credentials.")
        elif choice == "3":
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
    conn.close()
