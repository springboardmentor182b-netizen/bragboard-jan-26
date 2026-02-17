<<<<<<< HEAD
"""
Authentication Controller
API endpoints for login and registration
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from src.database.connection import get_db
from src.database.config import ACCESS_TOKEN_EXPIRE_MINUTES
from .service import AuthService
from src.users.service import UserService
from src.users.models import UserRole

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

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
    # Check if email already exists
    existing_user = UserService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = UserService.create_user(
        db=db,
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        department=user_data.department,
        role=UserRole.EMPLOYEE
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.id, "email": user.email},
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
    # Authenticate user
    user = AuthService.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.get("/me")
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Get current authenticated user"""
    user = AuthService.get_current_user(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user.to_dict()

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Successfully logged out"}
=======
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import SessionLocal
from src.auth.models import RegisterRequest, LoginRequest
from src.auth.service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        return register_user(db, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        return login_user(db, data)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
>>>>>>> ff6b9ac298133bc779a2d2610a3f4eda536800c3
