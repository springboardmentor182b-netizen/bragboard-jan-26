from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from src.core.database import get_db
from src.users.models import User
from typing import List
from pydantic import BaseModel

router = APIRouter()

class UserSchema(BaseModel):
    id: int
    email: str
    role: str
    full_name: str | None = None
    job_title: str | None = None
    email_notifications: bool = True
    shoutout_alerts: bool = True
    marketing_emails: bool = False

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    full_name: str | None = None
    job_title: str | None = None
    email_notifications: bool | None = None
    shoutout_alerts: bool | None = None
    marketing_emails: bool | None = None


class LeaderboardEntry(BaseModel):
    user_id: int
    email: str
    role: str
    points: int


@router.get("/", response_model=List[UserSchema])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    # Simple logic: 100 points per shoutout received
    from src.entities.shoutout import Shoutout
    results = db.query(
        User.id.label("user_id"),
        User.email,
        User.role,
        (func.count(Shoutout.id) * 100).label("points")
    ).outerjoin(Shoutout, User.id == Shoutout.receiver_id)\
    .group_by(User.id)\
    .order_by(text("points DESC"))\
    .limit(10).all()
    
    return [dict(r._asdict()) for r in results]

@router.get("/me", response_model=UserSchema)
def get_current_user(db: Session = Depends(get_db)):
    # Hardcoded to ID 2 until auth is fully integrated
    user = db.query(User).filter(User.id == 2).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me", response_model=UserSchema)
def update_current_user(user_update: UserUpdate, db: Session = Depends(get_db)):
    # Hardcoded to ID 2 until auth is fully integrated
    user = db.query(User).filter(User.id == 2).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user


