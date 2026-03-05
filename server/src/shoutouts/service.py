from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from fastapi import HTTPException, status

from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.user import User
from src.entities.shoutout_like import ShoutoutLike
from src.shoutouts.models import ShoutoutCreate


def create_shoutout(db: Session, shoutout_data: ShoutoutCreate):
    tag_string = ",".join(shoutout_data.tags)
    new_shoutout = Shoutout(
        sender_id=shoutout_data.sender_id,
        message=shoutout_data.message,
        tags=tag_string,
    )
    db.add(new_shoutout)
    db.commit()
    db.refresh(new_shoutout)

    for r_id in shoutout_data.recipient_ids:
        recipient = ShoutoutRecipient(shoutout_id=new_shoutout.id, recipient_id=r_id)
        db.add(recipient)

    db.commit()
    return db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.recipients).joinedload(ShoutoutRecipient.recipient),
    ).filter(Shoutout.id == new_shoutout.id).first()


def get_all_shoutouts(db: Session):
    """Get all shoutouts with sender and recipients eagerly loaded."""
    return (
        db.query(Shoutout)
        .options(
            joinedload(Shoutout.sender),
            joinedload(Shoutout.recipients).joinedload(ShoutoutRecipient.recipient),
        )
        .order_by(Shoutout.created_at.desc())
        .all()
    )


def get_my_shoutouts(db: Session, user_id: int):
    """Get shoutouts sent by OR received by the given user."""
    sent = db.query(Shoutout).filter(Shoutout.sender_id == user_id)
    received = db.query(Shoutout).join(ShoutoutRecipient).filter(
        ShoutoutRecipient.recipient_id == user_id
    )
    seen = set()
    results = []
    for s in list(sent.all()) + list(received.all()):
        if s.id not in seen:
            seen.add(s.id)
            results.append(s)

    if not results:
        return []
    ids = [s.id for s in results]
    return (
        db.query(Shoutout)
        .options(
            joinedload(Shoutout.sender),
            joinedload(Shoutout.recipients).joinedload(ShoutoutRecipient.recipient),
        )
        .filter(Shoutout.id.in_(ids))
        .order_by(Shoutout.created_at.desc())
        .all()
    )


def get_leaderboard(db: Session):
    """Count how many shoutouts each user RECEIVED — most appreciated."""
    results = (
        db.query(
            User.id,
            User.name,
            User.department,
            func.count(ShoutoutRecipient.id).label("score"),
        )
        .join(ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id)
        .group_by(User.id)
        .order_by(desc("score"))
        .limit(10)
        .all()
    )
    return [
        {
            "id": r.id,
            "name": r.name,
            "department": r.department or "General",
            "score": r.score,
        }
        for r in results
    ]


def get_department_stats(db: Session):
    """Count users and shoutouts per department."""
    results = []
    departments = (
        db.query(User.department)
        .filter(User.department.isnot(None), User.department != "")
        .distinct()
        .all()
    )

    for (dept_name,) in departments:
        member_count = db.query(User).filter(User.department == dept_name).count()
        shoutout_count = (
            db.query(ShoutoutRecipient)
            .join(User)
            .filter(User.department == dept_name)
            .count()
        )
        results.append(
            {
                "name": dept_name,
                "member_count": member_count,
                "shoutout_count": shoutout_count,
            }
        )

    return sorted(results, key=lambda x: x["shoutout_count"], reverse=True)


def like_shoutout(db: Session, shoutout_id: int, user_id: int):
    """
    Toggle a like on a shoutout for the given user.

    - First call  → adds a like record and increments shoutout.likes
    - Second call → removes the like record and decrements shoutout.likes
    """
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shoutout not found",
        )

    existing_like = (
        db.query(ShoutoutLike)
        .filter(
            ShoutoutLike.shoutout_id == shoutout_id,
            ShoutoutLike.user_id == user_id,
        )
        .first()
    )

    if existing_like:
        # Toggle OFF: remove the like
        db.delete(existing_like)
        shoutout.likes = max(0, (shoutout.likes or 0) - 1)
    else:
        # Toggle ON: add the like
        new_like = ShoutoutLike(shoutout_id=shoutout_id, user_id=user_id)
        db.add(new_like)
        shoutout.likes = (shoutout.likes or 0) + 1

    db.commit()

    # Return with relationships loaded so the response serialises cleanly
    return (
        db.query(Shoutout)
        .options(
            joinedload(Shoutout.sender),
            joinedload(Shoutout.recipients).joinedload(ShoutoutRecipient.recipient),
        )
        .filter(Shoutout.id == shoutout_id)
        .first()
    )