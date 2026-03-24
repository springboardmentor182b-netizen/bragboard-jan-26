from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from src.database.core import get_db

from src.entities.shoutout import Shoutout
from src.entities.comment import ShoutoutComment
from src.entities.reaction import ShoutoutReaction
from src.users.models import User
from .schemas import ShoutoutCreate, ShoutoutOut, ShoutoutStats, CommentCreate, ShoutoutCommentOut, ReactionCreate, ShoutoutReactionOut
from typing import List
from sqlalchemy import func

router = APIRouter()

@router.post("/", response_model=ShoutoutOut)
def create_shoutout(shoutout: ShoutoutCreate, db: Session = Depends(get_db)):
    # Hardcoded to ID 2 (employee) for now until auth is fully implemented
    db_shoutout = Shoutout(
        sender_id=2, 
        receiver_id=shoutout.receiver_id,
        message=shoutout.message
    )
    db.add(db_shoutout)
    db.commit()
    db.refresh(db_shoutout)
    return db_shoutout

@router.get("/", response_model=List[ShoutoutOut])
def get_shoutouts(db: Session = Depends(get_db)):
    return db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.receiver),
        joinedload(Shoutout.reactions),
        joinedload(Shoutout.comments).joinedload(ShoutoutComment.user)
    ).order_by(Shoutout.created_at.desc()).all()

@router.get("/mine", response_model=List[ShoutoutOut])
def get_my_shoutouts(db: Session = Depends(get_db)):
    # Hardcoded to ID 2
    return db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.receiver),
        joinedload(Shoutout.reactions),
        joinedload(Shoutout.comments).joinedload(ShoutoutComment.user)
    ).filter(
        (Shoutout.sender_id == 2) | (Shoutout.receiver_id == 2)
    ).order_by(Shoutout.created_at.desc()).all()


@router.get("/comments/mine", response_model=List[ShoutoutCommentOut])
def get_my_comments(sent: bool = True, db: Session = Depends(get_db)):
    if sent:
        return db.query(ShoutoutComment).options(joinedload(ShoutoutComment.user)).filter(ShoutoutComment.user_id == 2).order_by(ShoutoutComment.created_at.desc()).all()
    else:
        # Received: comments on my shoutouts
        return db.query(ShoutoutComment)\
            .options(joinedload(ShoutoutComment.user))\
            .join(Shoutout, ShoutoutComment.shoutout_id == Shoutout.id)\
            .filter(Shoutout.receiver_id == 2)\
            .order_by(ShoutoutComment.created_at.desc()).all()



@router.post("/{shoutout_id}/comment", response_model=ShoutoutCommentOut)
def add_comment(shoutout_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    # Hardcoded to ID 2
    db_comment = ShoutoutComment(
        shoutout_id=shoutout_id,
        user_id=2,
        message=comment.message
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.post("/{shoutout_id}/react", response_model=ShoutoutReactionOut)
def add_reaction(shoutout_id: int, reaction: ReactionCreate, db: Session = Depends(get_db)):
    # Simple toggle logic for reactions from this user
    user_id = 2 # Hardcoded
    existing = db.query(ShoutoutReaction).filter(
        ShoutoutReaction.shoutout_id == shoutout_id,
        ShoutoutReaction.user_id == user_id,
        ShoutoutReaction.type == reaction.type
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return existing # Not technically correct after delete, but schemas need something. In real life we'd just return a status
    
    db_reaction = ShoutoutReaction(
        shoutout_id=shoutout_id,
        user_id=user_id,
        type=reaction.type
    )
    db.add(db_reaction)
    db.commit()
    db.refresh(db_reaction)
    return db_reaction

@router.get("/stats", response_model=ShoutoutStats)
def get_shoutout_stats(db: Session = Depends(get_db)):
    total = db.query(Shoutout).count()
    return {
        "total_this_week": total,
        "top_value": "Teamwork",
        "your_kudos": 5
    }
