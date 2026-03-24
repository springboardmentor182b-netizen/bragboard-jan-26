#!/usr/bin/env python3
"""
Admin Promotion Script for BragBoard
Easily promote users to admin role

Usage:
    python create_admin.py
    # Then enter email when prompted

Or:
    python create_admin.py admin@company.com
"""

import sys
from sqlalchemy import create_engine, text
from src.database.config import settings


def make_admin(email: str) -> bool:
    """
    Promote a user to admin role
    
    Args:
        email: Email address of the user to promote
        
    Returns:
        True if successful, False if user not found
    """
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # First check if user exists
            check_result = conn.execute(
                text("SELECT id, name, email, role FROM users WHERE email = :email"),
                {"email": email}
            )
            user = check_result.fetchone()
            
            if not user:
                print(f"❌ Error: No user found with email '{email}'")
                print("\nAvailable users:")
                
                # Show all users
                all_users = conn.execute(text("SELECT email, name, role FROM users ORDER BY id"))
                for u in all_users:
                    role_icon = "👑" if u[2] == "admin" else "👤"
                    print(f"  {role_icon} {u[0]} - {u[1]} ({u[2]})")
                
                return False
            
            user_id, name, user_email, current_role = user
            
            # Check if already admin
            if current_role == "admin":
                print(f"ℹ️  {name} ({user_email}) is already an admin!")
                return True
            
            # Promote to admin - use enum value explicitly for PostgreSQL ENUM column
            conn.execute(
                text("UPDATE users SET role = CAST('admin' AS userrole) WHERE email = :email"),
                {"email": email}
            )
            conn.commit()
            
            print(f"✅ Success! {name} ({user_email}) has been promoted to admin!")
            print(f"   Previous role: {current_role}")
            print(f"   New role: admin")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def demote_admin(email: str) -> bool:
    """
    Demote an admin to employee role
    
    Args:
        email: Email address of the admin to demote
        
    Returns:
        True if successful, False if user not found
    """
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Check if user exists and is admin
            check_result = conn.execute(
                text("SELECT name, role FROM users WHERE email = :email"),
                {"email": email}
            )
            user = check_result.fetchone()
            
            if not user:
                print(f"❌ Error: No user found with email '{email}'")
                return False
            
            name, current_role = user
            
            if current_role == "employee":
                print(f"ℹ️  {name} ({email}) is already an employee!")
                return True
            
            # Demote to employee - use enum value explicitly for PostgreSQL ENUM column
            conn.execute(
                text("UPDATE users SET role = CAST('employee' AS userrole) WHERE email = :email"),
                {"email": email}
            )
            conn.commit()
            
            print(f"✅ Success! {name} ({email}) has been demoted to employee")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def list_users():
    """Display all users with their roles"""
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT id, name, email, role, department FROM users ORDER BY id")
            )
            
            users = result.fetchall()
            
            if not users:
                print("No users found in database.")
                return
            
            print("\n" + "="*70)
            print("All Users in BragBoard")
            print("="*70)
            print(f"{'ID':<5} {'Name':<20} {'Email':<25} {'Role':<10} {'Dept':<15}")
            print("-"*70)
            
            for user in users:
                user_id, name, email, role, dept = user
                role_icon = "👑" if role == "admin" else "👤"
                print(f"{user_id:<5} {name:<20} {email:<25} {role_icon} {role:<8} {dept or 'N/A':<15}")
            
            print("="*70)
            
            # Count stats
            admin_count = sum(1 for u in users if u[3] == "admin")
            employee_count = len(users) - admin_count
            
            print(f"\nTotal: {len(users)} users ({admin_count} admins, {employee_count} employees)")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")


def interactive_mode():
    """Interactive menu for user management"""
    while True:
        print("\n" + "="*50)
        print("BragBoard Admin Management")
        print("="*50)
        print("1. List all users")
        print("2. Promote user to admin")
        print("3. Demote admin to employee")
        print("4. Exit")
        print("="*50)
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            list_users()
            
        elif choice == "2":
            email = input("Enter email address to promote to admin: ").strip()
            if email:
                make_admin(email)
            else:
                print("❌ Email cannot be empty")
                
        elif choice == "3":
            email = input("Enter email address to demote to employee: ").strip()
            if email:
                demote_admin(email)
            else:
                print("❌ Email cannot be empty")
                
        elif choice == "4":
            print("\n👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please enter 1-4.")


def main():
    """Main entry point"""
    print("\n" + "="*50)
    print("BragBoard - Admin Promotion Tool")
    print("="*50 + "\n")
    
    # Check if email provided as command line argument
    if len(sys.argv) > 1:
        if sys.argv[1] in ["-h", "--help", "help"]:
            print(__doc__)
            return
        
        email = sys.argv[1]
        make_admin(email)
    else:
        # Interactive mode
        interactive_mode()


if __name__ == "__main__":
    main()