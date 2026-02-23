from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, EmailStr
from src.database.connection import get_db
from .service import UserService
from .models import UserRole

router = APIRouter()

# Pydantic models for request/response
class UserCreate(BaseModel):
    """Schema for creating a user"""
    name: str
    email: EmailStr
    password: str
    department: str
    role: UserRole = UserRole.EMPLOYEE

class UserUpdate(BaseModel):
    """Schema for updating a user"""
    name: str = None
    department: str = None
    role: UserRole = None

class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    name: str
    email: str
    department: str
    role: str
    joined_at: str = None
    
    class Config:
        from_attributes = True

class UserStats(BaseModel):
    """Schema for user statistics"""
    total_users: int
    active_users: int
    admins: int
    managers: int
    employees: int

# API Endpoints
@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all users with pagination"""
    users = UserService.get_all_users(db, skip, limit)
    return [user.to_dict() for user in users]

@router.get("/stats", response_model=UserStats)
async def get_user_stats(db: Session = Depends(get_db)):
    """Get user statistics for admin dashboard"""
    total_users = UserService.get_user_count(db)
    role_counts = UserService.get_users_count_by_role(db)
    
    return {
        "total_users": total_users,
        "active_users": total_users,  # For now, all users are active
        "admins": role_counts.get("admin", 0),
        "managers": role_counts.get("manager", 0),
        "employees": role_counts.get("employee", 0)
    }

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a specific user by ID"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user.to_dict()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if email already exists
    existing_user = UserService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = UserService.create_user(
        db=db,
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        department=user_data.department,
        role=user_data.role
    )
    return user.to_dict()

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    """Update a user"""
    user = UserService.update_user(
        db=db,
        user_id=user_id,
        name=user_data.name,
        department=user_data.department,
        role=user_data.role
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user.to_dict()

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user"""
    success = UserService.delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return None

@router.get("/department/{department}", response_model=List[UserResponse])
async def get_users_by_department(department: str, db: Session = Depends(get_db)):
    """Get all users in a specific department"""
    users = UserService.get_users_by_department(db, department)
    return [user.to_dict() for user in users]

@router.get("/role/{role}", response_model=List[UserResponse])
async def get_users_by_role(role: UserRole, db: Session = Depends(get_db)):
    """Get all users with a specific role"""
    users = UserService.get_users_by_role(db, role)
    return [user.to_dict() for user in users]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.connection import engine
from .service import register_user, authenticate_user, generate_tokens
from pydantic import BaseModel, EmailStr


router = APIRouter(prefix="/auth", tags=["Authentication"])
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        register_user(db, user)
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return generate_tokens(db_user)

