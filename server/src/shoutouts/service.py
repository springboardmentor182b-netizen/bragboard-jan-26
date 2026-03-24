from typing import List

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from fastapi import HTTPException, status

from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.user import User
from src.shoutouts.models import ShoutoutCreate
from src.moderation.service import moderate_message


def create_shoutout(db: Session, sender_id: int, data: ShoutoutCreate) -> Shoutout:
    # AI Moderation — block harmful content before saving
    result = moderate_message(data.message)
    if not result.is_safe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Message flagged: {result.reason}",
        )

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
    # Reload with relationships so response includes sender + recipients
    return db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.shoutout_recipients).joinedload(ShoutoutRecipient.recipient)
    ).filter(Shoutout.id == shoutout.id).first()


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
    return db.query(Shoutout).join(
        ShoutoutRecipient, Shoutout.id == ShoutoutRecipient.shoutout_id
    ).filter(
        (Shoutout.sender_id == user_id) | (ShoutoutRecipient.recipient_id == user_id)
    ).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.shoutout_recipients).joinedload(ShoutoutRecipient.recipient)
    ).distinct().all()


def get_leaderboard(db: Session):
    """Count how many shoutouts each user RECEIVED — most appreciated."""
    results = db.query(
        User.id,
        User.name,
        User.department,
        func.count(ShoutoutRecipient.id).label('score')
    ).join(ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id)\
     .group_by(User.id)\
     .order_by(desc('score'))\
     .limit(10).all()

    return [
        {
            "id": r.id,
            "name": r.name,
            "department": r.department or "General",
            "score": r.score
        }
        for r in results
    ]


def get_department_stats(db: Session):
    """Count users and shoutouts per department."""
    results = []
    departments = db.query(User.department).filter(
        User.department.isnot(None), User.department != ""
    ).distinct().all()

    for (dept_name,) in departments:
        member_count = db.query(User).filter(User.department == dept_name).count()
        shoutout_count = db.query(ShoutoutRecipient).join(User).filter(
            User.department == dept_name
        ).count()
        results.append({
            "name": dept_name,
            "member_count": member_count,
            "shoutout_count": shoutout_count
        })

    return sorted(results, key=lambda x: x["shoutout_count"], reverse=True)


def like_shoutout(db: Session, shoutout_id: int):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if shoutout:
        shoutout.likes = (shoutout.likes or 0) + 1
        db.commit()
        db.refresh(shoutout)
    return shoutout
