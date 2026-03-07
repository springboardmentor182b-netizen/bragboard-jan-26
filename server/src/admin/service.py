"""
Business logic for admin endpoints.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from src.entities.user import User, UserRole
from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.audit_log import AuditLog


# ═══════════════════════════════════════════════════════════════════════════
#  ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════

def get_analytics_stats(db: Session) -> dict:
    """Aggregate dashboard statistics."""
    total_users = db.query(User).count()
    total_shoutouts = db.query(Shoutout).count()
    total_likes = db.query(func.coalesce(func.sum(Shoutout.likes), 0)).scalar()
    total_flagged = db.query(Shoutout).filter(Shoutout.is_flagged == True).count()

    return {
        "total_users": total_users,
        "total_shoutouts": total_shoutouts,
        "total_likes": int(total_likes),
        "total_flagged": total_flagged,
    }


def get_top_performers(db: Session, limit: int = 5) -> list:
    """Top users by number of shoutouts received."""
    results = (
        db.query(
            User.name,
            User.department,
            func.count(ShoutoutRecipient.id).label("count"),
        )
        .join(ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id)
        .group_by(User.id, User.name, User.department)
        .order_by(desc("count"))
        .limit(limit)
        .all()
    )

    return [
        {
            "name": r.name,
            "department": r.department or "General",
            "count": r.count,
        }
        for r in results
    ]


def get_category_stats(db: Session) -> list:
    """
    Count shoutouts per tag/category.
    Tags are stored as comma-separated strings on Shoutout.tags.
    """
    shoutouts = db.query(Shoutout.tags).filter(Shoutout.tags.isnot(None), Shoutout.tags != "").all()

    tag_counts: dict[str, int] = {}
    for (tags_str,) in shoutouts:
        for tag in tags_str.split(","):
            tag = tag.strip()
            if tag:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

    sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
    return [{"name": name, "count": count} for name, count in sorted_tags[:10]]


# ═══════════════════════════════════════════════════════════════════════════
#  USER MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

def get_all_users_admin(db: Session) -> list:
    """Return all users with full details for the admin table."""
    users = db.query(User).order_by(User.id).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "department": u.department or "General",
            "role": u.role.value if u.role else "employee",
            "joined_at": u.joined_at,
        }
        for u in users
    ]


def update_user_role(db: Session, user_id: int, new_role: str) -> dict:
    """Change a user's role. Returns updated user info."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    user.role = UserRole(new_role)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "department": user.department or "General",
        "role": user.role.value,
        "joined_at": user.joined_at,
    }


def delete_user(db: Session, user_id: int) -> bool:
    """Delete a user from the database. Returns True if successful."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False

    db.delete(user)
    db.commit()
    return True


# ═══════════════════════════════════════════════════════════════════════════
#  MODERATION
# ═══════════════════════════════════════════════════════════════════════════

def get_flagged_shoutouts(db: Session) -> list:
    """Get all flagged shoutouts for the moderation queue."""
    shoutouts = (
        db.query(Shoutout)
        .filter(Shoutout.is_flagged == True)
        .order_by(Shoutout.created_at.desc())
        .all()
    )

    return [_shoutout_to_dict(s) for s in shoutouts]


def get_all_shoutouts_admin(db: Session) -> list:
    """Get ALL shoutouts (flagged and unflagged) for admin view."""
    shoutouts = (
        db.query(Shoutout)
        .order_by(Shoutout.created_at.desc())
        .all()
    )

    return [_shoutout_to_dict(s) for s in shoutouts]


def flag_shoutout(db: Session, shoutout_id: int) -> dict | None:
    """Flag a shoutout for moderation."""
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        return None

    shoutout.is_flagged = True
    db.commit()
    db.refresh(shoutout)
    return {"shoutout_id": shoutout.id, "is_flagged": True, "message": "Shoutout flagged"}


def unflag_shoutout(db: Session, shoutout_id: int) -> dict | None:
    """Remove flag from a shoutout."""
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        return None

    shoutout.is_flagged = False
    db.commit()
    db.refresh(shoutout)
    return {"shoutout_id": shoutout.id, "is_flagged": False, "message": "Shoutout unflagged"}


def delete_shoutout(db: Session, shoutout_id: int) -> bool:
    """Admin-delete a shoutout."""
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        return False

    db.delete(shoutout)
    db.commit()
    return True


def _shoutout_to_dict(s: Shoutout) -> dict:
    """Convert a Shoutout ORM object to a dict for the moderation view."""
    sender = s.sender
    recipient_names = [r.recipient.name for r in s.recipients] if s.recipients else []

    return {
        "id": s.id,
        "sender_name": sender.name if sender else "Unknown",
        "sender_email": sender.email if sender else "",
        "message": s.message,
        "tags": s.tags,
        "likes": s.likes or 0,
        "is_flagged": s.is_flagged or False,
        "created_at": s.created_at,
        "recipient_names": recipient_names,
    }


# ═══════════════════════════════════════════════════════════════════════════
#  AUDIT LOGS
# ═══════════════════════════════════════════════════════════════════════════

def log_admin_action(
    db: Session,
    admin_id: int,
    action: str,
    target_type: str,
    target_id: int | None = None,
    details: str | None = None,
):
    """Record an admin action in the audit log."""
    entry = AuditLog(
        admin_id=admin_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=details,
    )
    db.add(entry)
    db.commit()


def get_audit_logs(db: Session, limit: int = 50) -> list:
    """Get recent audit log entries."""
    logs = (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": log.id,
            "admin_name": log.admin.name if log.admin else "Unknown",
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "details": log.details,
            "created_at": log.created_at,
        }
        for log in logs
    ]
