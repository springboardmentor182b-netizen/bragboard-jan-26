from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database.connection import get_db
from ..entities.user import User, UserRole, UserStatus
from .service import hash_password, verify_password, create_access_token
from .models import UserRegister, UserLogin, Token, ForgotPasswordRequest, VerifySecurityAnswerRequest
from src.auth.dependencies import get_current_user
from src.entities.user import User
from fastapi import HTTPException, status

#router for authentication endpoints
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ==================== REGISTRATION ENDPOINT ====================

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user - Account will be PENDING until admin approval
    
    IMPORTANT: This is an internal tool. New registrations require admin approval.
    Users cannot login until an admin approves their account.
    """
    
    # Step 1: Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Step 2: Validate password strength
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Step 3: Hash the password (NEVER store plain passwords!)
    hashed_pwd = hash_password(user_data.password)
    
    # Hash the security answer too (for security)
    hashed_answer = hash_password(user_data.security_answer.lower().strip())
    
    # Step 4: Create new user object with PENDING status
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pwd,
        department=user_data.department,
        role=UserRole.employee,  # Default role is employee
        status=UserStatus.pending,  # NEW: Set to pending by default
        security_question=user_data.security_question,
        security_answer=hashed_answer
    )
    
    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Step 5: Return success response with pending status message
    return {
        "message": "Registration successful! Your account is pending admin approval.",
        "status": "pending",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "department": new_user.department,
            "role": new_user.role.value,
            "status": new_user.status.value  # NEW: Include status in response
        },
        "next_steps": "Please wait for an administrator to approve your account. You will be able to login once approved."
    }

# ==================== LOGIN ENDPOINT ====================

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return access token
    
    NEW: Only approved users can login. Pending/rejected/suspended users are blocked.
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
    
    # Step 3: NEW - Check approval status before allowing login
    if user.status == UserStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is pending admin approval. Please contact your administrator to get your account approved.",
        )
    
    if user.status == UserStatus.rejected:
        rejection_msg = f"Your account has been rejected by an administrator."
        if user.rejection_reason:
            rejection_msg += f" Reason: {user.rejection_reason}"
        rejection_msg += " Please contact HR or your administrator for more information."
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=rejection_msg,
        )
    
    if user.status == UserStatus.suspended:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended. Please contact your administrator.",
        )
    
    # Step 4: Create JWT access token (only for approved users)
    access_token = create_access_token(
        data={
            "user_id": user.id,
            "email": user.email,
            "role": user.role.value
        }
    )
    
    # Step 5: Return token
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "department": user.department,
            "role": user.role.value
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
    
    # Validate new password strength
    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long"
        )
    
    # Update password
    user.password = hash_password(request.new_password)
    db.commit()
    
    return {
        "message": "Password reset successfully! You can now login with your new password.",
        "success": True
    }