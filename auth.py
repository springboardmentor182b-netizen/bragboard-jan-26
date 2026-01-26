# Dummy database (for demo/testing)
users = {
    "user@example.com": "1234"  # email: password
}

# Function to simulate login
def login():
    print("\n---- Login ----")
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

# Function to simulate signup/contact HR
def contact_hr():
    print("\n---- Contact HR ----")
    print("Please contact HR to create an account.\n")

# Function to simulate forgot password
def forgot_password():
    print("\n---- Forgot Password ----")
    print("A password reset link has been sent to your email (simulated).\n")

# Main menu to simulate login page options
def main():
    while True:
        print("Login Page Options:")
        print("1. Sign in")
        print("2. Forgot password")
        print("3. Don't have an account? Contact HR")
        print("4. Exit")
        
        choice = input("Enter choice (1/2/3/4): ")
        
        if choice == "1":
            login()
        elif choice == "2":
            forgot_password()
        elif choice == "3":
            contact_hr()
        elif choice == "4":
            print("Exiting...\n")
            break
        else:
            print("Invalid choice! Try again.\n")

if __name__ == "__main__":
    main()
