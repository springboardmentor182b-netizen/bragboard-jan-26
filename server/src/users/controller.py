from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.database.connection import get_db
from src.schemas.user import User, UserCreate
from src.users import service as user_service
# Need to import auth controller for get_current_user dependency or define it in a common place

router = APIRouter()

@router.post("/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_service.create_user(db=db, user=user)

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Basic implementation, in real app add pagination in service
    from src.entities.user import User as UserModel
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users
