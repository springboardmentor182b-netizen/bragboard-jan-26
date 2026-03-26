from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil, os
from src.database.database import get_db
from src.entities import models, schemas

router = APIRouter(tags=["ShoutOuts"])


def _create_notification(db: Session, user_id: int, actor_id: int, shoutout_id: int, type: str):
    """Helper: create a notification, skip if actor == recipient (don't notify yourself)."""
    if user_id == actor_id:
        return
    notif = models.Notification(
        user_id=user_id,
        actor_id=actor_id,
        shoutout_id=shoutout_id,
        type=type
    )
    db.add(notif)
    db.commit()


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
        media_url=shoutout.media_url,
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


@router.post("/shoutouts/{shoutout_id}/react")
def react_to_shoutout(shoutout_id: int, emoji: str, user_id: int, db: Session = Depends(get_db)):
    """Add a reaction emoji to a shoutout and notify the author."""
    db_shoutout = db.query(models.ShoutOut).filter(models.ShoutOut.id == shoutout_id).first()
    if not db_shoutout:
        raise HTTPException(status_code=404, detail="ShoutOut not found")

    reactions = dict(db_shoutout.reactions or {})
    reactions[emoji] = reactions.get(emoji, 0) + 1
    db_shoutout.reactions = reactions
    db.commit()

    # Notify the shoutout sender that someone liked it
    _create_notification(db, user_id=db_shoutout.sender_id, actor_id=user_id,
                         shoutout_id=shoutout_id, type="like")

    db.refresh(db_shoutout)
    return {"reactions": db_shoutout.reactions}


@router.post("/shoutouts/{shoutout_id}/media")
def upload_shoutout_media(shoutout_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload an image or video attachment for a shoutout."""
    db_shoutout = db.query(models.ShoutOut).filter(models.ShoutOut.id == shoutout_id).first()
    if not db_shoutout:
        raise HTTPException(status_code=404, detail="ShoutOut not found")

    allowed = {"image/jpeg", "image/png", "image/gif", "video/mp4", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    ext = file.filename.split(".")[-1]
    filename = f"shoutout_{shoutout_id}_media.{ext}"
    file_location = f"static/{filename}"

    if not os.path.exists("static"):
        os.makedirs("static")

    with open(file_location, "wb+") as f:
        shutil.copyfileobj(file.file, f)

    # Use relative URL so it works regardless of host
    media_url = f"/static/{filename}"
    db_shoutout.media_url = media_url
    db.commit()

    return {"media_url": media_url}


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

    # Notify the shoutout sender that someone commented
    _create_notification(db, user_id=db_shoutout.sender_id, actor_id=user_id,
                         shoutout_id=comment.shoutout_id, type="comment")

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
