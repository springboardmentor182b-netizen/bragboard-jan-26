from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.shoutouts.models import ShoutoutCreate


def create_shoutout(db: Session, sender_id: int, data: ShoutoutCreate) -> Shoutout:
    shoutout = Shoutout(sender_id=sender_id, message=data.message)
    db.add(shoutout)
    db.flush()  # get the shoutout.id

    for rid in data.recipient_ids:
        recipient = ShoutoutRecipient(shoutout_id=shoutout.id, recipient_id=rid)
        db.add(recipient)

    db.commit()
    db.refresh(shoutout)
    return shoutout


def get_all_shoutouts(db: Session, skip: int = 0, limit: int = 20) -> List[Shoutout]:
    return db.query(Shoutout).order_by(Shoutout.created_at.desc()).offset(skip).limit(limit).all()


def get_shoutout_by_id(db: Session, shoutout_id: int) -> Shoutout:
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")
    return shoutout


def delete_shoutout(db: Session, shoutout_id: int, user_id: int, user_role: str) -> None:
    shoutout = get_shoutout_by_id(db, shoutout_id)
    if shoutout.sender_id != user_id and user_role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(shoutout)
    db.commit()
