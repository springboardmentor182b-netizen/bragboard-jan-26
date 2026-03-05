
"""
Authentication Controller
API endpoints for login and registration
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from src.database.connection import get_db
from src.database.config import ACCESS_TOKEN_EXPIRE_MINUTES
from .service import AuthService
from src.users.service import UserService
from src.users.models import UserRole

router = APIRouter()

# Pydantic models
class UserRegister(BaseModel):
    """Schema for user registration"""
    name: str
    email: EmailStr
    password: str
    department: str

class Token(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str
    user: dict

class LoginRequest(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str

# API Endpoints
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
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
        role="employee"
    )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    user = AuthService.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }
