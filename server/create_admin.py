#!/usr/bin/env python3
"""
Admin Promotion Script for BragBoard
Easily promote users to admin role and manage approval status

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
    Promote a user to admin role and automatically approve them
    
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
                text("SELECT id, name, email, role, status FROM users WHERE email = :email"),
                {"email": email}
            )
            user = check_result.fetchone()
            
            if not user:
                print(f"❌ Error: No user found with email '{email}'")
                print("\nAvailable users:")
                
                # Show all users
                all_users = conn.execute(text("""
                    SELECT email, name, role, status 
                    FROM users 
                    ORDER BY id
                """))
                for u in all_users:
                    role_icon = "👑" if u[2] == "admin" else "👤"
                    status_icon = "✅" if u[3] == "approved" else "⏳" if u[3] == "pending" else "❌"
                    print(f"  {role_icon} {status_icon} {u[0]} - {u[1]} ({u[2]}, {u[3]})")
                
                return False
            
            user_id, name, user_email, current_role, current_status = user
            
            # Check if already admin
            if current_role == "admin" and current_status == "approved":
                print(f"ℹ️  {name} ({user_email}) is already an approved admin!")
                return True
            
            # Promote to admin AND approve automatically
            # Admins should always be approved
            conn.execute(
                text("""
                    UPDATE users 
                    SET role = CAST('admin' AS userrole),
                        status = CAST('approved' AS userstatus),
                        approved_at = CURRENT_TIMESTAMP
                    WHERE email = :email
                """),
                {"email": email}
            )
            conn.commit()
            
            print(f"✅ Success! {name} ({user_email}) has been promoted to admin!")
            print(f"   Previous role: {current_role}")
            print(f"   Previous status: {current_status}")
            print(f"   New role: admin")
            print(f"   New status: approved")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n💡 Tip: Make sure you've run the migration script first:")
        print("   python migrate_add_approval_status.py")
        return False


def demote_admin(email: str) -> bool:
    """
    Demote an admin to employee role (keeps approved status)
    
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
            
            # Check if this is the last admin
            admin_count_result = conn.execute(
                text("""
                    SELECT COUNT(*) 
                    FROM users 
                    WHERE role = CAST('admin' AS userrole) 
                    AND status = CAST('approved' AS userstatus)
                """)
            )
            admin_count = admin_count_result.fetchone()[0]
            
            if admin_count <= 1:
                print(f"❌ Error: Cannot demote the last admin!")
                print("   Promote another user to admin first.")
                return False
            
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
    """Display all users with their roles and approval status"""
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("""
                    SELECT id, name, email, role, department, status 
                    FROM users 
                    ORDER BY 
                        CASE WHEN role = CAST('admin' AS userrole) THEN 0 ELSE 1 END,
                        id
                """)
            )
            
            users = result.fetchall()
            
            if not users:
                print("No users found in database.")
                return
            
            print("\n" + "="*85)
            print("All Users in BragBoard")
            print("="*85)
            print(f"{'ID':<5} {'Name':<20} {'Email':<25} {'Role':<10} {'Status':<12} {'Dept':<15}")
            print("-"*85)
            
            for user in users:
                user_id, name, email, role, dept, status = user
                role_icon = "👑" if role == "admin" else "👤"
                status_icon = "✅" if status == "approved" else "⏳" if status == "pending" else "❌" if status == "rejected" else "🚫"
                dept_display = dept or 'N/A'
                print(f"{user_id:<5} {name:<20} {email:<25} {role_icon} {role:<8} {status_icon} {status:<10} {dept_display:<15}")
            
            print("="*85)
            
            # Count stats
            admin_count = sum(1 for u in users if u[3] == "admin")
            employee_count = len(users) - admin_count
            pending_count = sum(1 for u in users if u[5] == "pending")
            approved_count = sum(1 for u in users if u[5] == "approved")
            rejected_count = sum(1 for u in users if u[5] == "rejected")
            suspended_count = sum(1 for u in users if u[5] == "suspended")
            
            print(f"\nTotal: {len(users)} users")
            print(f"  👑 Admins: {admin_count} | 👤 Employees: {employee_count}")
            print(f"  ✅ Approved: {approved_count} | ⏳ Pending: {pending_count} | ❌ Rejected: {rejected_count} | 🚫 Suspended: {suspended_count}")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")


def approve_user(email: str) -> bool:
    """
    Manually approve a pending user
    
    Args:
        email: Email address of the user to approve
        
    Returns:
        True if successful, False otherwise
    """
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Check if user exists
            check_result = conn.execute(
                text("SELECT name, status FROM users WHERE email = :email"),
                {"email": email}
            )
            user = check_result.fetchone()
            
            if not user:
                print(f"❌ Error: No user found with email '{email}'")
                return False
            
            name, current_status = user
            
            if current_status == "approved":
                print(f"ℹ️  {name} ({email}) is already approved!")
                return True
            
            # Approve user
            conn.execute(
                text("""
                    UPDATE users 
                    SET status = CAST('approved' AS userstatus),
                        approved_at = CURRENT_TIMESTAMP
                    WHERE email = :email
                """),
                {"email": email}
            )
            conn.commit()
            
            print(f"✅ Success! {name} ({email}) has been approved!")
            print(f"   Previous status: {current_status}")
            print(f"   New status: approved")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def interactive_mode():
    """Interactive menu for user management"""
    while True:
        print("\n" + "="*50)
        print("BragBoard Admin Management")
        print("="*50)
        print("1. List all users")
        print("2. Promote user to admin")
        print("3. Demote admin to employee")
        print("4. Approve pending user")
        print("5. Exit")
        print("="*50)
        
        choice = input("\nEnter your choice (1-5): ").strip()
        
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
            email = input("Enter email address to approve: ").strip()
            if email:
                approve_user(email)
            else:
                print("❌ Email cannot be empty")
                
        elif choice == "5":
            print("\n👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please enter 1-5.")


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