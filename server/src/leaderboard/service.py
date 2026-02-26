from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from src.entities.user import User
from src.entities.shoutout import Shoutout, ShoutoutRecipient


def get_top_contributors(db: Session, limit: int = 10):
    """
    Get users who sent the most shout-outs
    """
    results = (
        db.query(
            User.id,
            User.name,
            User.department,
            func.count(Shoutout.id).label("count")
        )
        .join(Shoutout, User.id == Shoutout.sender_id)
        .group_by(User.id, User.name, User.department)
        .order_by(desc("count"))
        .limit(limit)
        .all()
    )

    return [
        {
            "rank": i + 1,
            "id": r.id,
            "name": r.name,
            "department": r.department or "General",
            "count": r.count
        }
        for i, r in enumerate(results)
    ]


def get_most_appreciated(db: Session, limit: int = 10):
    """
    Get users who received the most shout-outs
    """
    results = (
        db.query(
            User.id,
            User.name,
            User.department,
            func.count(ShoutoutRecipient.id).label("count")
        )
        .join(ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id)
        .group_by(User.id, User.name, User.department)
        .order_by(desc("count"))
        .limit(limit)
        .all()
    )

    return [
        {
            "rank": i + 1,
            "id": r.id,
            "name": r.name,
            "department": r.department or "General",
            "count": r.count
        }
        for i, r in enumerate(results)
    ]


def get_department_stats(db: Session):
    """
    Get shout-out counts and member counts per department
    """
    departments = db.query(User.department).distinct().all()
    results = []

    for (dept_name,) in departments:
        if not dept_name:
            continue

        member_count = (
            db.query(User)
            .filter(User.department == dept_name)
            .count()
        )

        shoutout_count = (
            db.query(ShoutoutRecipient)
            .join(User, ShoutoutRecipient.recipient_id == User.id)
            .filter(User.department == dept_name)
            .count()
        )

        results.append({
            "name": dept_name,
            "member_count": member_count,
            "shoutout_count": shoutout_count
        })

    return sorted(results, key=lambda x: x["shoutout_count"], reverse=True)