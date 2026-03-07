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
