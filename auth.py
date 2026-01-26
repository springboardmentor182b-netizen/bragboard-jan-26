users = {
    "user@example.com": "1234"  
}

# Function to simulate login
def login():
    print("---- Login ----")
    email = input("Enter email: ")
    password = input("Enter password: ")
    
    # Remember me checkbox (simulated)
    remember = input("Remember me? (yes/no): ").lower()
    
    if email in users and users[email] == password:
        print("Login successful!")
        if remember == "yes":
            print("We will remember you next time.")
        print("Redirecting to Dashboard...\n")
    else:
        print("Invalid credentials! Try again.\n")

# Function to simulate signup (optional, for demo)
def signup():
    print("---- Signup ----")
    email = input("Enter email: ")
    if email in users:
        print("Email already registered!")
        return
    password = input("Enter password: ")
    users[email] = password
    print("Signup successful!\n")

# Main menu to simulate login page options
def main():
    while True:
        print("Choose an option:")
        print("1. Sign in")
        print("2. Signup (if no account)")
        print("3. Forgot password")
        print("4. Exit")
        
        choice = input("Enter choice (1/2/3/4): ")
        
        if choice == "1":
            login()
        elif choice == "2":
            signup()
        elif choice == "3":
            print("Forgot password link clicked (simulate sending email)\n")
        elif choice == "4":
            print("Exiting...")
            break
        else:
            print("Invalid choice! Try again.\n")

if __name__ == "__main__":
    main()

