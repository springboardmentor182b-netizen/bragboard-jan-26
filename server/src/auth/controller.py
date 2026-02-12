from datetime import timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import (
    authenticate_user,
    create_access_token,
    get_current_user,
    register_new_user,
)
from src.auth.models import (
    Token,
    UserLogin,
    UserRegister,
    UserResponse,
    ForgotPasswordRequest,
    VerifySecurityAnswerRequest,
)
from src.database.config import settings
from src.entities.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user."""
    return register_new_user(db, user_data)


@router.post("/login", response_model=Token)
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and return JWT token."""
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # CRITICAL: user.id must be string for jose compatibility
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "department": user.department,
            "role": user.role
        }
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get information for currently logged-in user."""
    return current_user


# --- NEW PASSWORD RECOVERY ROUTES ---

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Placeholder for actual logic from main-group-D
    return {"message": "If the email exists, security questions will be retrieved."}


@router.post("/verify-security-answer")
def verify_security_answer(request: VerifySecurityAnswerRequest, db: Session = Depends(get_db)):
    # Placeholder for actual logic from main-group-D
    return {"message": "Password reset logic would go here."}
