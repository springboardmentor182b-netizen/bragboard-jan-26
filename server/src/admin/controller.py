from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.dependencies import get_current_user  # ← FIXED: Import from dependencies
from src.entities.user import User, UserRole
from src.admin import service
from src.admin.models import AdminLogResponse, ChangeRoleRequest

router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Guard: only admins may proceed."""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


# ─── Analytics Endpoints ──────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """
    Platform-wide overview stats.
    Returns total_users, total_shoutouts, total_likes, active_this_week.
    """
    return service.get_platform_stats(db)


@router.get("/analytics/top-contributors")
def top_contributors(
    limit: int = Query(10, ge=1, le=50),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Users ranked by shoutouts sent."""
    return service.get_top_contributors(db, limit)


@router.get("/analytics/most-appreciated")
def most_appreciated(
    limit: int = Query(10, ge=1, le=50),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Users ranked by shoutouts received."""
    return service.get_most_appreciated(db, limit)


@router.get("/analytics/departments")
def department_stats(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Engagement stats broken down by department."""
    return service.get_department_stats(db)


# ─── User Management Endpoints ────────────────────────────────────────────────

@router.get("/users")
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Return all users (id, name, email, department, role, joined_at)."""
    return service.list_all_users(db)


@router.patch("/users/{user_id}/role")
def change_role(
    user_id: int,
    body: ChangeRoleRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Promote or demote a user.
    Body: { "role": "admin" | "employee" }
    """
    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admins cannot change their own role",
        )
    try:
        updated = service.change_user_role(db, user_id, body.role)
        service.log_admin_action(db, admin.id, f"Changed role to {body.role}", user_id, "user")
        return updated
    except LookupError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# ─── User Approval Endpoints ──────────────────────────────────────────────────
# NEW: These endpoints replace the backend create_admin.py script

@router.get("/users/pending")
def get_pending_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Get all users awaiting approval.
    Returns list of users with status='pending'
    """
    return service.get_pending_users(db)


@router.patch("/users/{user_id}/approve")
def approve_user_request(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Approve a pending user registration.
    User will be able to login after approval.
    """
    try:
        result = service.approve_user(db, user_id, admin.id)
        service.log_admin_action(
            db,
            admin.id,
            f"Approved user registration",
            user_id,
            "user"
        )
        return result
    except LookupError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/users/{user_id}/reject")
def reject_user_request(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Reject a pending user registration.
    User will not be able to login.
    """
    try:
        result = service.reject_user(db, user_id, admin.id)
        service.log_admin_action(
            db,
            admin.id,
            f"Rejected user registration",
            user_id,
            "user"
        )
        return result
    except LookupError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.patch("/users/{user_id}/suspend")
def suspend_user_account(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Suspend an approved user account.
    User will not be able to login while suspended.
    """
    try:
        result = service.suspend_user(db, user_id, admin.id)
        service.log_admin_action(
            db,
            admin.id,
            f"Suspended user account",
            user_id,
            "user"
        )
        return result
    except LookupError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ─── Moderation Endpoints ────────────────────────────────────────────────────

@router.get("/shoutouts")
def list_shoutouts(
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """All shoutouts with sender/recipient details — for moderation review."""
    return service.list_all_shoutouts(db, limit)


@router.delete("/shoutouts/{shoutout_id}")
def delete_shoutout(
    shoutout_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Hard-delete a shoutout (moderation action)."""
    try:
        result = service.delete_shoutout(db, shoutout_id)
        service.log_admin_action(db, admin.id, "Deleted shoutout", shoutout_id, "shoutout")
        return result
    except LookupError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ─── Admin Logs Endpoint ─────────────────────────────────────────────────────

@router.get("/logs", response_model=List[AdminLogResponse])
def get_logs(
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Recent admin action log entries."""
    return service.get_admin_logs(db, limit)