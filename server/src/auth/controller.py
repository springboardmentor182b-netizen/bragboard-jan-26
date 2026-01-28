from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database.connection import get_db
from ..entities.user import User, UserRole
from .service import hash_password, verify_password, create_access_token
from .models import UserRegister, UserLogin, Token, ForgotPasswordRequest, VerifySecurityAnswerRequest

#router for authentication endpoints
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ==================== REGISTRATION ENDPOINT ====================

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    
    # Step 1: Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Step 2: Hash the password (NEVER store plain passwords!)
    hashed_pwd = hash_password(user_data.password)
    
    # Hash the security answer too (for security)
    hashed_answer = hash_password(user_data.security_answer.lower().strip())
    
    # Step 3: Create new user object
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pwd,  # Store hashed password
        department=user_data.department,
        role=UserRole.employee,  # Default role is employee
        security_question=user_data.security_question,
        security_answer=hashed_answer  # Store hashed answer
    )
    
    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Get the updated object with ID from database
    
    # Step 4: Return success response
    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "department": new_user.department,
            "role": new_user.role
        }
    }

# ==================== LOGIN ENDPOINT ====================

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return access token
    """
    
    # Step 1: Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    # Step 2: Check if user exists and password is correct
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Step 3: Create JWT access token
    access_token = create_access_token(
        data={
            "user_id": user.id,
            "email": user.email,
            "role": user.role.value
        }
    )
    
    # Step 4: Return token
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

# ==================== PASSWORD RESET WITH SECURITY QUESTION ====================

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Get security question for password reset
    
    """
    
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address"
        )
    
    if not user.security_question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No security question set for this account. Please contact support."
        )
    
    return {
        "email": user.email,
        "security_question": user.security_question,
        "message": "Please answer your security question to reset your password"
    }

@router.post("/reset-password")
def reset_password_with_security(request: VerifySecurityAnswerRequest, db: Session = Depends(get_db)):
    """
    Reset password using security question answer
    """
    
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify security answer (case-insensitive, trimmed)
    provided_answer = request.security_answer.lower().strip()
    
    if not verify_password(provided_answer, user.security_answer):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect security answer. Please try again."
        )
    
    # Update password
    user.password = hash_password(request.new_password)
    db.commit()
    
    return {
        "message": "Password reset successfully! You can now login with your new password.",
        "success": True
    }