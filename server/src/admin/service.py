from datetime import datetime, timedelta, timezone
from typing import Optional, List

from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from src.entities.user import User, UserRole, UserStatus
from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.admin_log import AdminLog


# ─── Helper: record an admin action ──────────────────────────────────────────

def log_admin_action(
    db: Session,
    admin_id: int,
    action: str,
    target_id: Optional[int] = None,
    target_type: Optional[str] = None,
):
    """
    Write an entry to the admin_logs table.
    Silently skips if the AdminLog entity hasn't been created yet so
    other endpoints remain usable during development.
    """
    try:
        entry = AdminLog(
            admin_id=admin_id,
            action=action,
            target_id=target_id,
            target_type=target_type,
            timestamp=datetime.now(timezone.utc),
        )
        db.add(entry)
        db.commit()
    except Exception:
        db.rollback()   # ✅ FIXED: rollback so the session stays usable


def get_all_admin_logs(db: Session) -> List[AdminLog]:
    return db.query(AdminLog).order_by(AdminLog.timestamp.desc()).all()


def create_admin_log(
    db: Session,
    admin_id: int,
    action: str,
    target_id: int = None,
    target_type: str = None,
) -> AdminLog:
    log = AdminLog(
        admin_id=admin_id,
        action=action,
        target_id=target_id,
        target_type=target_type,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


# ─── Analytics / Stats ───────────────────────────────────────────────────────

def get_platform_stats(db: Session) -> dict:
    """Return high-level platform-wide counts."""
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_shoutouts = db.query(func.count(Shoutout.id)).scalar() or 0
    total_likes = db.query(func.coalesce(func.sum(Shoutout.likes), 0)).scalar() or 0

    one_week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    active_this_week = (
        db.query(func.count(Shoutout.id))
        .filter(Shoutout.created_at >= one_week_ago)
        .scalar()
        or 0
    )

    return {
        "total_users": total_users,
        "total_shoutouts": total_shoutouts,
        "total_likes": int(total_likes),
        "active_this_week": active_this_week,
    }


def get_top_contributors(db: Session, limit: int = 10) -> list[dict]:
    """Users ranked by number of shoutouts *sent*."""
    rows = (
        db.query(
            User.id,
            User.name,
            User.department,
            func.count(Shoutout.id).label("count"),
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
            "count": r.count,
        }
        for i, r in enumerate(rows)
    ]


def get_most_appreciated(db: Session, limit: int = 10) -> list[dict]:
    """Users ranked by number of shoutouts *received*."""
    rows = (
        db.query(
            User.id,
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
            "rank": i + 1,
            "id": r.id,
            "name": r.name,
            "department": r.department or "General",
            "count": r.count,
        }
        for i, r in enumerate(rows)
    ]


def get_department_stats(db: Session) -> list[dict]:
    """Shoutout counts and member counts per department, sorted by engagement."""
    departments = (
        db.query(User.department).filter(User.department.isnot(None)).distinct().all()
    )

    results = []
    for (dept_name,) in departments:
        if not dept_name:
            continue

        member_count = (
            db.query(func.count(User.id))
            .filter(User.department == dept_name)
            .scalar()
            or 0
        )

        shoutout_count = (
            db.query(func.count(ShoutoutRecipient.id))
            .join(User, ShoutoutRecipient.recipient_id == User.id)
            .filter(User.department == dept_name)
            .scalar()
            or 0
        )

        results.append(
            {
                "name": dept_name,
                "member_count": member_count,
                "shoutout_count": shoutout_count,
            }
        )

    return sorted(results, key=lambda x: x["shoutout_count"], reverse=True)


# ─── User Management ─────────────────────────────────────────────────────────

def list_all_users(db: Session) -> list[dict]:
    """Return all users with their basic admin-visible fields."""
    users = db.query(User).order_by(User.joined_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "department": u.department or "—",
            "role": u.role.value if u.role else "employee",
            "status": u.status.value if u.status else "approved",
            "joined_at": u.joined_at.isoformat() if u.joined_at else None,
        }
        for u in users
    ]


def change_user_role(db: Session, target_user_id: int, new_role: str) -> dict:
    """Promote or demote a user. Returns updated user dict."""
    if new_role not in ("employee", "admin"):
        raise ValueError(f"Invalid role: {new_role}")

    user = db.query(User).filter(User.id == target_user_id).first()
    if not user:
        raise LookupError(f"User {target_user_id} not found")

    user.role = UserRole[new_role]
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
    }


# ─── User Approval Workflow ───────────────────────────────────────────────────
# ✅ ADDED: These 4 functions were missing — admin_controller.py calls all of
#    them. Without them every approval endpoint returned a 500 AttributeError.

def get_pending_users(db: Session) -> list[dict]:
    """Return all users whose status is 'pending', newest first."""
    users = (
        db.query(User)
        .filter(User.status == UserStatus.pending)
        .order_by(User.joined_at.desc())
        .all()
    )
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "department": u.department or "Not Specified",
            "joined_at": u.joined_at.isoformat() if u.joined_at else None,
            "status": u.status.value,
        }
        for u in users
    ]


def approve_user(db: Session, user_id: int, admin_id: int) -> dict:
    """
    Approve a pending user so they can log in.

    Raises:
        LookupError  – user not found
        ValueError   – user is not in pending status
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise LookupError(f"User {user_id} not found")

    if user.status != UserStatus.pending:
        raise ValueError(
            f"User is already '{user.status.value}'. Only pending users can be approved."
        )

    user.status = UserStatus.approved
    user.approved_by = admin_id
    user.approved_at = datetime.now(timezone.utc)
    user.rejection_reason = None
    db.commit()
    db.refresh(user)

    return {
        "message": f"User '{user.name}' ({user.email}) approved successfully.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "status": user.status.value,
            "approved_by": user.approved_by,
            "approved_at": user.approved_at.isoformat(),
        },
    }


def reject_user(db: Session, user_id: int, admin_id: int) -> dict:
    """
    Reject a pending user registration.

    Raises:
        LookupError – user not found
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise LookupError(f"User {user_id} not found")

    user.status = UserStatus.rejected
    user.approved_by = None
    user.approved_at = None
    db.commit()
    db.refresh(user)

    return {
        "message": f"User '{user.name}' ({user.email}) has been rejected.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "status": user.status.value,
        },
    }


def suspend_user(db: Session, user_id: int, admin_id: int) -> dict:
    """
    Suspend an approved user so they can no longer log in.

    Raises:
        LookupError – user not found
        ValueError  – user is already suspended
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise LookupError(f"User {user_id} not found")

    if user.status == UserStatus.suspended:
        raise ValueError(f"User '{user.name}' is already suspended.")

    user.status = UserStatus.suspended
    db.commit()
    db.refresh(user)

    return {
        "message": f"User '{user.name}' ({user.email}) has been suspended.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "status": user.status.value,
        },
    }


# ─── Moderation — Shoutout Management ────────────────────────────────────────

def list_all_shoutouts(db: Session, limit: int = 50) -> list[dict]:
    """Return recent shoutouts with sender + recipient info (for admin review)."""
    shoutouts = (
        db.query(Shoutout)
        .order_by(Shoutout.created_at.desc())
        .limit(limit)
        .all()
    )

    result = []
    for s in shoutouts:
        recipient_names = [r.recipient.name for r in s.recipients if r.recipient]
        result.append(
            {
                "id": s.id,
                "sender_name": s.sender.name if s.sender else "Unknown",
                "sender_email": s.sender.email if s.sender else "",
                "message": s.message,
                "tags": s.tags,
                "likes": s.likes or 0,
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "recipient_names": recipient_names,
            }
        )

    return result


def delete_shoutout(db: Session, shoutout_id: int) -> dict:
    """Hard-delete a shoutout (admin moderation). Returns confirmation."""
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise LookupError(f"Shoutout {shoutout_id} not found")

    db.delete(shoutout)
    db.commit()

    return {"message": "Shoutout deleted successfully", "shoutout_id": shoutout_id}


# ─── Admin Logs ──────────────────────────────────────────────────────────────

def get_admin_logs(db: Session, limit: int = 50) -> list[dict]:
    """Retrieve the most recent admin action log entries."""
    try:
        logs = (
            db.query(AdminLog)
            .order_by(AdminLog.timestamp.desc())
            .limit(limit)
            .all()
        )

        result = []
        for log in logs:
            # ✅ Safe manual lookup — no ORM relationship on AdminLog
            admin = db.query(User).filter(User.id == log.admin_id).first()
            result.append(
                {
                    "id": log.id,
                    "admin_id": log.admin_id,
                    "admin_name": admin.name if admin else "Unknown",
                    "action": log.action,
                    "target_id": log.target_id,
                    "target_type": log.target_type,
                    "timestamp": log.timestamp.isoformat() if log.timestamp else None,
                }
            )

        return result

    except Exception:
        # AdminLog entity/table not yet available
        return []