<<<<<<< HEAD
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.users.models import UserResponse, UserUpdate
from src.users import service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all users."""
    return service.get_all_users(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a user by ID."""
    return service.get_user_by_id(db, user_id)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a user profile. Users can only update themselves; admins can update anyone."""
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return service.update_user(db, user_id, user_data)


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a user (admin only)."""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    service.delete_user(db, user_id)
=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database.connection import get_db
from src.entities.user import User

router = APIRouter()


@router.get("/", tags=["Users"])
def get_all_users(db: Session = Depends(get_db)):
    """
    Get all users — used to populate the recipient dropdown in Create Shoutout modal.
    Returns id, name, department, email for every registered user.
    """
    users = db.query(User).order_by(User.name).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "department": u.department or "General",
            "email": u.email,
            "role": u.role.value if u.role else "employee"
        }
        for u in users
    ]


@router.get("/{user_id}", tags=["Users"])
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Get a single user by ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "department": user.department or "General",
        "email": user.email,
        "role": user.role.value if user.role else "employee"
    }
>>>>>>> origin/main-group-D
