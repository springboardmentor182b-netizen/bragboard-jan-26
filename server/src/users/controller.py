from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.database.connection import get_db
from src.entities.user import User
from src.auth.dependencies import get_current_user  # ← ADD THIS

router = APIRouter()


# ENDPOINT 1: Get All Users
@router.get("/", tags=["Users"])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """
    Get all users (requires authentication).
    Used to populate recipient dropdown in Create Shoutout modal.
    Note: Emails are NOT exposed for privacy.
    """
    users = db.query(User).order_by(User.name).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "department": u.department or "General",
            # Email removed for privacy - don't expose to all users
            "role": u.role.value if u.role else "employee"
        }
        for u in users
    ]


# ENDPOINT 2: Get User By ID
@router.get("/{user_id}", tags=["Users"])
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get a single user by ID (requires authentication)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {
        "id": user.id,
        "name": user.name,
        "department": user.department or "General",
        # Email removed for privacy
        "role": user.role.value if user.role else "employee"
    }