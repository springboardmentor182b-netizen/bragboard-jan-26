from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional

from src.entities.user import User
from src.entities.shoutout import ShoutOut, ShoutOutRecipient
from src.entities.comment import Comment
from src.entities.reaction import Reaction
from src.users.models import (
    UserSummary,
    DashboardStats,
    ShoutOutOut,
    CommentOut,
    ReactionCount,
    EmployeeDashboardResponse,
    ShoutOutFeedResponse,
    LeaderboardEntry,
    LeaderboardResponse,
)


def _build_shoutout_out(shoutout: ShoutOut) -> ShoutOutOut:
    reaction_counts = ReactionCount()
    for r in shoutout.reactions:
        t = r.type.value if hasattr(r.type, 'value') else r.type
        if t == "like":
            reaction_counts.like += 1
        elif t == "clap":
            reaction_counts.clap += 1
        elif t == "star":
            reaction_counts.star += 1

    comments_out = [
        CommentOut(
            id=c.id,
            user_id=c.user_id,
            user_name=c.user.name if c.user else "Unknown",
            content=c.content,
            created_at=c.created_at,
        )
        for c in shoutout.comments
    ]

    recipients_out = [
        UserSummary(
            id=r.recipient.id,
            name=r.recipient.name,
            email=r.recipient.email,
            department=r.recipient.department,
            role=r.recipient.role.value if hasattr(r.recipient.role, 'value') else r.recipient.role,
        )
        for r in shoutout.recipients
        if r.recipient
    ]

    return ShoutOutOut(
        id=shoutout.id,
        sender_id=shoutout.sender_id,
        sender_name=shoutout.sender.name if shoutout.sender else "Unknown",
        sender_department=shoutout.sender.department if shoutout.sender else None,
        message=shoutout.message,
        created_at=shoutout.created_at,
        recipients=recipients_out,
        reaction_counts=reaction_counts,
        comments=comments_out,
        total_comments=len(comments_out),
    )


def get_employee_dashboard(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    shoutouts_sent = db.query(ShoutOut).filter(
        ShoutOut.sender_id == user_id
    ).count()

    received_shoutout_ids = db.query(ShoutOutRecipient.shoutout_id).filter(
        ShoutOutRecipient.recipient_id == user_id
    ).subquery()

    shoutouts_received = db.query(ShoutOut).filter(
        ShoutOut.id.in_(received_shoutout_ids)
    ).count()

    reactions_received = db.query(Reaction).join(
        ShoutOut, Reaction.shoutout_id == ShoutOut.id
    ).filter(ShoutOut.id.in_(received_shoutout_ids)).count()

    comments_received = db.query(Comment).filter(
        Comment.shoutout_id.in_(received_shoutout_ids)
    ).count()

    recent_received = db.query(ShoutOut).join(
        ShoutOutRecipient, ShoutOut.id == ShoutOutRecipient.shoutout_id
    ).filter(
        ShoutOutRecipient.recipient_id == user_id
    ).order_by(desc(ShoutOut.created_at)).limit(5).all()

    recent_sent = db.query(ShoutOut).filter(
        ShoutOut.sender_id == user_id
    ).order_by(desc(ShoutOut.created_at)).limit(5).all()

    role_val = user.role.value if hasattr(user.role, 'value') else user.role

    return EmployeeDashboardResponse(
        user=UserSummary(
            id=user.id,
            name=user.name,
            email=user.email,
            department=user.department,
            role=role_val,
        ),
        stats=DashboardStats(
            total_shoutouts_received=shoutouts_received,
            total_shoutouts_sent=shoutouts_sent,
            total_reactions_received=reactions_received,
            total_comments_received=comments_received,
        ),
        recent_received_shoutouts=[_build_shoutout_out(s) for s in recent_received],
        recent_sent_shoutouts=[_build_shoutout_out(s) for s in recent_sent],
    )


def get_all_employees(db: Session):
    users = db.query(User).all()
    return [
        UserSummary(
            id=u.id,
            name=u.name,
            email=u.email,
            department=u.department,
            role=u.role.value if hasattr(u.role, 'value') else u.role,
        )
        for u in users
    ]


def get_shoutout_feed(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    department: Optional[str] = None,
    sender_id: Optional[int] = None,
):
    query = db.query(ShoutOut)

    if department:
        query = query.join(User, ShoutOut.sender_id == User.id).filter(
            User.department == department
        )
    if sender_id:
        query = query.filter(ShoutOut.sender_id == sender_id)

    total = query.count()
    shoutouts = query.order_by(desc(ShoutOut.created_at)).offset(
        (page - 1) * page_size
    ).limit(page_size).all()

    return ShoutOutFeedResponse(
        shoutouts=[_build_shoutout_out(s) for s in shoutouts],
        total=total,
        page=page,
        page_size=page_size,
    )


def get_leaderboard(db: Session, limit: int = 10):
    results = db.query(
        User.id,
        User.name,
        User.department,
        func.count(ShoutOutRecipient.id).label("shoutouts_received"),
    ).join(
        ShoutOutRecipient, User.id == ShoutOutRecipient.recipient_id
    ).group_by(
        User.id, User.name, User.department
    ).order_by(desc("shoutouts_received")).limit(limit).all()

    entries = []
    for row in results:
        received_ids = db.query(ShoutOutRecipient.shoutout_id).filter(
            ShoutOutRecipient.recipient_id == row.id
        ).subquery()

        reactions = db.query(Reaction).filter(
            Reaction.shoutout_id.in_(received_ids)
        ).count()

        entries.append(LeaderboardEntry(
            user_id=row.id,
            user_name=row.name,
            department=row.department,
            shoutouts_received=row.shoutouts_received,
            reactions_received=reactions,
        ))

    return LeaderboardResponse(top_employees=entries)
