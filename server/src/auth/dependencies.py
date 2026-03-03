from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError
from .service import decode_access_token
from ..entities.user import User, UserRole, UserStatus
from ..database.connection import get_db

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Verify JWT token and return current authenticated user.
    
    ✅ FIXED: Now validates user status (approved/pending/rejected/suspended)
    ✅ SECURITY: Prevents unapproved users from accessing the system
    
    Args:
        credentials: JWT bearer token from Authorization header
        db: Database session
    
    Returns:
        User: Authenticated and approved user object
    
    Raises:
        HTTPException: If token invalid, user not found, or user not approved
    """
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id = payload.get("user_id")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # ═══════════════════════════════════════════════════════════════
        # ✅ SECURITY FIX: Validate user status
        # ═══════════════════════════════════════════════════════════════
        if user.status != UserStatus.approved:
            status_messages = {
                UserStatus.pending: "Your account is pending admin approval. Please wait for an administrator to review your registration.",
                UserStatus.rejected: "Your account has been rejected. Please contact support for more information.",
                UserStatus.suspended: "Your account has been suspended. Please contact support to resolve this issue."
            }
            error_message = status_messages.get(
                user.status, 
                "Your account is not active. Please contact support."
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=error_message
            )
        
        return user
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Ensure the current user has admin role.
    
    Args:
        current_user: User object from get_current_user dependency
    
    Returns:
        User: Admin user object
    
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required. This action is restricted to administrators only."
        )
    return current_user