from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from src.database.database import get_db
from src.entities import models, schemas

router = APIRouter(tags=["ShoutOuts"])

@router.post("/shoutouts/", response_model=schemas.ShoutOut)
def create_shoutout(shoutout: schemas.ShoutOutCreate, sender_id: int, db: Session = Depends(get_db)):
    db_sender = db.query(models.User).filter(models.User.id == sender_id).first()
    if not db_sender:
         raise HTTPException(status_code=404, detail="Sender not found")
         
    db_shoutout = models.ShoutOut(
        content=shoutout.content,
        sender_id=sender_id,
        recipient_id=shoutout.recipient_id,
        tags=shoutout.tags,
        reactions={},
        comments=[]
    )
    db.add(db_shoutout)
    db.commit()
    db.refresh(db_shoutout)
    return db_shoutout

@router.get("/shoutouts/", response_model=List[schemas.ShoutOut])
def read_shoutouts(skip: int = 0, limit: int = 100, sender_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.ShoutOut)
    if sender_id:
        query = query.filter(models.ShoutOut.sender_id == sender_id)
    shoutouts = query.order_by(models.ShoutOut.created_at.desc()).offset(skip).limit(limit).all()
    return shoutouts

@router.post("/comments/", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_shoutout = db.query(models.ShoutOut).filter(models.ShoutOut.id == comment.shoutout_id).first()
    if not db_shoutout:
        raise HTTPException(status_code=404, detail="ShoutOut not found")

    db_comment = models.Comment(
        content=comment.content,
        user_id=user_id,
        shoutout_id=comment.shoutout_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    leaderboard = []
    
    for user in users:
        sent_count = db.query(models.ShoutOut).filter(models.ShoutOut.sender_id == user.id).count()
        received_shoutouts = db.query(models.ShoutOut).filter(models.ShoutOut.recipient_id == user.id).all()
        received_count = len(received_shoutouts)
        
        reactions_count = 0
        for shoutout in received_shoutouts:
            if shoutout.reactions:
                reactions_count += sum(shoutout.reactions.values())

        points = (sent_count * 10) + (received_count * 20) + (reactions_count * 2)
        
        leaderboard.append({
            "id": user.id,
            "name": user.full_name,
            "profile_picture": user.profile_picture,
            "sent": sent_count,
            "received": received_count,
            "reactions": reactions_count,
            "points": points
        })
    
    leaderboard.sort(key=lambda x: x['points'], reverse=True)
    return leaderboard
