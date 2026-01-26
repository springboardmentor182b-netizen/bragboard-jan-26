users = {}

def signup():
    print("---- Signup ----")
    email = input("Enter email: ")
    if email in users:
        print("Email already registered!")
        return
    password = input("Enter password: ")
    users[email] = password
    print("Signup successful!\n")

def login():
    print("---- Login ----")
    email = input("Enter email: ")
    password = input("Enter password: ")
    if email in users and users[email] == password:
        print("Login successful!\n")
    else:
        print("Invalid credentials!\n")

def main():
    while True:
        print("Choose an option:")
        print("1. Signup")
        print("2. Login")
        print("3. Exit")
        choice = input("Enter choice (1/2/3): ")
        if choice == "1":
            signup()
        elif choice == "2":
            login()
        elif choice == "3":
            print("Exiting...")
            break
        else:
            print("Invalid choice! Try again.\n")

if __name__ == "__main__":
    main()
