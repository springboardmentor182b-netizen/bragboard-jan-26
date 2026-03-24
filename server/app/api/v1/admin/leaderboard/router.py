from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.database.core import get_db
from src.entities.user import User
from src.entities.shoutout import Shoutout
from pydantic import BaseModel  # <--- Add this line

router = APIRouter()

@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):
    results = (
        db.query(
            User.name,
            func.count(Shoutout.id).label("shoutout_count")
        )
        .join(Shoutout, User.id == Shoutout.receiver) # Links User ID to Shoutout Receiver ID
        .group_by(User.name)
        .order_by(func.count(Shoutout.id).desc())
        .limit(10)
        .all()
    )
    
    return [{"name": r.name, "shoutout_count": r.shoutout_count} for r in results]
   

# This defines what data the server expects to receive
class ShoutoutCreate(BaseModel):
    sender: str
    receiver_id: int
    content: str

@router.post("/shoutout")
def create_shoutout(payload: ShoutoutCreate, db: Session = Depends(get_db)):
    new_shoutout = Shoutout(
        sender=payload.sender,
        receiver=payload.receiver_id,
        content=payload.content
    )
    db.add(new_shoutout)
    db.commit()
    return {"message": "Shoutout sent successfully!"}
    # Add this inside server/app/api/v1/admin/leaderboard/router.py

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "name": u.name} for u in users]