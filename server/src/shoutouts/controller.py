from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.config import get_db
from src.shoutouts.models import ShoutoutCreate, ShoutoutResponse, DashboardStats
from src.shoutouts.service import ShoutoutService
from typing import List

router = APIRouter()  # No prefix here!

@router.post("/", response_model=ShoutoutResponse)
def create_shoutout(shoutout: ShoutoutCreate, db: Session = Depends(get_db)):
    db_shoutout = ShoutoutService.create_shoutout(db, shoutout)
    
    return {
        "id": db_shoutout.id,
        "sender": db_shoutout.sender,
        "recipients": [r.recipient for r in db_shoutout.recipients],
        "message": db_shoutout.message,
        "tags": [t.tag.name for t in db_shoutout.tags],
        "created_at": db_shoutout.created_at
    }

@router.get("/feed", response_model=List[ShoutoutResponse])
def get_shoutout_feed(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    shoutouts = ShoutoutService.get_all_shoutouts(db, skip, limit)
    
    return [{
        "id": s.id,
        "sender": s.sender,
        "recipients": [r.recipient for r in s.recipients],
        "message": s.message,
        "tags": [t.tag.name for t in s.tags],
        "created_at": s.created_at
    } for s in shoutouts]

@router.get("/user/{user_id}/received", response_model=List[ShoutoutResponse])
def get_received_shoutouts(user_id: int, db: Session = Depends(get_db)):
    shoutouts = ShoutoutService.get_user_received_shoutouts(db, user_id)
    
    return [{
        "id": s.id,
        "sender": s.sender,
        "recipients": [r.recipient for r in s.recipients],
        "message": s.message,
        "tags": [t.tag.name for t in s.tags],
        "created_at": s.created_at
    } for s in shoutouts]

@router.get("/user/{user_id}/sent", response_model=List[ShoutoutResponse])
def get_sent_shoutouts(user_id: int, db: Session = Depends(get_db)):
    shoutouts = ShoutoutService.get_user_sent_shoutouts(db, user_id)
    
    return [{
        "id": s.id,
        "sender": s.sender,
        "recipients": [r.recipient for r in s.recipients],
        "message": s.message,
        "tags": [t.tag.name for t in s.tags],
        "created_at": s.created_at
    } for s in shoutouts]

@router.get("/dashboard/{user_id}", response_model=DashboardStats)
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    stats = ShoutoutService.get_dashboard_stats(db, user_id)
    
    recent_formatted = [{
        "id": s.id,
        "sender": s.sender,
        "recipients": [r.recipient for r in s.recipients],
        "message": s.message,
        "tags": [t.tag.name for t in s.tags],
        "created_at": s.created_at
    } for s in stats["recent_shoutouts"]]
    
    return {
        "shoutouts_received": stats["shoutouts_received"],
        "shoutouts_given": stats["shoutouts_given"],
        "leaderboard_rank": stats["leaderboard_rank"],
        "recent_shoutouts": recent_formatted
    }

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    return ShoutoutService.get_leaderboard(db)

@router.get("/tags")
def get_tags(db: Session = Depends(get_db)):
    tags = ShoutoutService.get_all_tags(db)
    return [{"id": t.id, "name": t.name} for t in tags]
