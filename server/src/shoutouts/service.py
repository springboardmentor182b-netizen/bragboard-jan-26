from typing import List

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from fastapi import HTTPException, status

from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.user import User
from src.shoutouts.models import ShoutoutCreate


def create_shoutout(db: Session, sender_id: int, data: ShoutoutCreate) -> Shoutout:
    tag_string = ",".join(data.tags) if data.tags else None
    shoutout = Shoutout(
        sender_id=sender_id, 
        message=data.message,
        tags=tag_string
    )
    db.add(shoutout)
    db.flush()  # get the shoutout.id

    for rid in data.recipient_ids:
        recipient = ShoutoutRecipient(shoutout_id=shoutout.id, recipient_id=rid)
        db.add(recipient)

    db.commit()
    db.refresh(shoutout)
    return shoutout


def get_all_shoutouts(db: Session, skip: int = 0, limit: int = 20) -> List[Shoutout]:
    return db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.shoutout_recipients).joinedload(ShoutoutRecipient.recipient)
    ).order_by(Shoutout.created_at.desc()).offset(skip).limit(limit).all()


def get_shoutout_by_id(db: Session, shoutout_id: int) -> Shoutout:
    shoutout = db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.shoutout_recipients).joinedload(ShoutoutRecipient.recipient)
    ).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")
    return shoutout


def delete_shoutout(db: Session, shoutout_id: int, user_id: int, user_role: str) -> None:
    shoutout = get_shoutout_by_id(db, shoutout_id)
    if shoutout.sender_id != user_id and user_role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(shoutout)
    db.commit()


def get_my_shoutouts(db: Session, user_id: int):
    # Get shoutouts sent by ME or received by ME
    return db.query(Shoutout).join(ShoutoutRecipient, Shoutout.id == ShoutoutRecipient.shoutout_id).filter(
        (Shoutout.sender_id == user_id) | (ShoutoutRecipient.recipient_id == user_id)
    ).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.shoutout_recipients).joinedload(ShoutoutRecipient.recipient)
    ).distinct().all()


def get_leaderboard(db: Session):
    # Count how many shoutouts each user RECEIVED
    return db.query(
        User.id,
        User.name,
        User.department,
        func.count(ShoutoutRecipient.id).label('score')
    ).join(ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id)\
     .group_by(User.id)\
     .order_by(desc('score'))\
     .limit(10).all()


def get_department_stats(db: Session):
    # Count users and shoutouts per department
    results = []
    departments = db.query(User.department).distinct().all()
    
    for dept in departments:
        d_name = dept[0]
        if not d_name: continue
        
        # Count members
        m_count = db.query(User).filter(User.department == d_name).count()
        
        # Count total shoutouts received by this department
        s_count = db.query(ShoutoutRecipient).join(User).filter(User.department == d_name).count()
        
        results.append({"name": d_name, "member_count": m_count, "shoutout_count": s_count})
    
    return results


def like_shoutout(db: Session, shoutout_id: int):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if shoutout:
        shoutout.likes += 1
        db.commit()
        db.refresh(shoutout)
    return shoutout
