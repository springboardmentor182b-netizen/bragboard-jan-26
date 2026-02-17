<<<<<<< HEAD
"""
User Service
Business logic for user operations
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from .models import User, UserRole
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    """User service with business logic"""
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def create_user(
        db: Session,
        name: str,
        email: str,
        password: str,
        department: str,
        role: UserRole = UserRole.EMPLOYEE
    ) -> User:
        """Create a new user"""
        hashed_password = UserService.get_password_hash(password)
        user = User(
            name=name,
            email=email,
            password=hashed_password,
            department=department,
            role=role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def update_user(
        db: Session,
        user_id: int,
        name: Optional[str] = None,
        department: Optional[str] = None,
        role: Optional[UserRole] = None
    ) -> Optional[User]:
        """Update user information"""
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return None
        
        if name:
            user.name = name
        if department:
            user.department = department
        if role:
            user.role = role
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """Delete a user"""
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return False
        
        db.delete(user)
        db.commit()
        return True
    
    @staticmethod
    def get_users_by_role(db: Session, role: UserRole) -> List[User]:
        """Get all users with a specific role"""
        return db.query(User).filter(User.role == role).all()
    
    @staticmethod
    def get_users_by_department(db: Session, department: str) -> List[User]:
        """Get all users in a department"""
        return db.query(User).filter(User.department == department).all()
    
    @staticmethod
    def get_user_count(db: Session) -> int:
        """Get total user count"""
        return db.query(User).count()
    
    @staticmethod
    def get_users_count_by_role(db: Session) -> dict:
        """Get count of users by role"""
        from sqlalchemy import func
        results = db.query(
            User.role,
            func.count(User.id).label('count')
        ).group_by(User.role).all()
        
        return {role.value: count for role, count in results}
=======
from sqlalchemy.orm import Session
from .models import User
from src.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token
)


def register_user(db: Session, user_data):

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise Exception("Email already registered")

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
        department=user_data.department,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user


def generate_tokens(user: User):

    payload = {
        "sub": user.email,
        "user_id": user.id,
        "role": user.role.value
    }

    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
>>>>>>> ff6b9ac298133bc779a2d2610a3f4eda536800c3
