from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.database.connection import get_db
from src.schemas.shoutout import Shoutout, ShoutoutCreate, Comment, CommentCreate
from src.auth.dependencies import get_current_user
from src.schemas.user import User
from src.shoutouts import service as shoutout_service

router = APIRouter()

@router.post("/", response_model=Shoutout)
def create_shoutout(
    shoutout: ShoutoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return shoutout_service.create_shoutout(db=db, shoutout=shoutout, sender_id=current_user.id)

@router.get("/", response_model=List[Shoutout])
def read_shoutouts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return shoutout_service.get_shoutouts(db=db, skip=skip, limit=limit)

@router.post("/{shoutout_id}/comments", response_model=Comment)
def create_comment(
    shoutout_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return shoutout_service.create_comment(
        db=db, 
        comment=comment, 
        shoutout_id=shoutout_id, 
        user_id=current_user.id
    )
