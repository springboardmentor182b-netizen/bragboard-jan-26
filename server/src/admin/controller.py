"""
Admin API endpoints.
All routes are protected by the `get_current_admin_user` dependency.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List

from src.database.connection import get_db
from src.auth.dependencies import get_current_admin_user
from src.entities.user import User
from src.admin import service, models

router = APIRouter(prefix="/admin", tags=["Admin"])


# ═══════════════════════════════════════════════════════════════════════════
#  ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/analytics", response_model=models.AnalyticsResponse)
def get_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Dashboard analytics: aggregate stats, top performers, and category breakdown."""
    stats = service.get_analytics_stats(db)
    top_performers = service.get_top_performers(db)
    category_stats = service.get_category_stats(db)

    return {
        "stats": stats,
        "top_performers": top_performers,
        "category_stats": category_stats,
    }


# ═══════════════════════════════════════════════════════════════════════════
#  USER MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/users", response_model=List[models.UserAdminResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """List all users with full details for admin management."""
    return service.get_all_users_admin(db)


@router.put("/users/{user_id}/role", response_model=models.UserAdminResponse)
def change_user_role(
    user_id: int,
    role_data: models.UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Change a user's role (employee ↔ admin)."""
    if role_data.role not in ("employee", "admin"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'employee' or 'admin'",
        )

    # Prevent admin from demoting themselves
    if user_id == admin.id and role_data.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot demote yourself",
        )

    result = service.update_user_role(db, user_id, role_data.role)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Log the action
    service.log_admin_action(
        db, admin.id, "change_role", "user", user_id,
        f"Changed role to {role_data.role}",
    )

    return result


@router.delete("/users/{user_id}", response_model=models.UserDeleteResponse)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Delete a user account."""
    # Prevent admin from deleting themselves
    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )

    # Get user info before deletion for audit log
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    target_name = target_user.name
    success = service.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Log the action
    service.log_admin_action(
        db, admin.id, "delete_user", "user", user_id,
        f"Deleted user: {target_name}",
    )

    return {"message": f"User '{target_name}' deleted successfully", "deleted_user_id": user_id}


# ═══════════════════════════════════════════════════════════════════════════
#  MODERATION
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/moderation", response_model=List[models.FlaggedShoutoutResponse])
def get_moderation_queue(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Get all flagged shoutouts for review."""
    return service.get_flagged_shoutouts(db)


@router.get("/moderation/all", response_model=List[models.FlaggedShoutoutResponse])
def get_all_shoutouts_for_moderation(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Get ALL shoutouts (for flagging from the admin panel)."""
    return service.get_all_shoutouts_admin(db)


@router.put("/shoutouts/{shoutout_id}/flag", response_model=models.FlagActionResponse)
def flag_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Flag a shoutout for moderation."""
    result = service.flag_shoutout(db, shoutout_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")

    service.log_admin_action(
        db, admin.id, "flag_shoutout", "shoutout", shoutout_id,
        "Flagged shoutout for review",
    )

    return result


@router.put("/shoutouts/{shoutout_id}/unflag", response_model=models.FlagActionResponse)
def unflag_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Remove flag from a shoutout (approve it)."""
    result = service.unflag_shoutout(db, shoutout_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")

    service.log_admin_action(
        db, admin.id, "unflag_shoutout", "shoutout", shoutout_id,
        "Approved shoutout (removed flag)",
    )

    return result


@router.delete("/shoutouts/{shoutout_id}")
def delete_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Permanently delete a shoutout."""
    success = service.delete_shoutout(db, shoutout_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")

    service.log_admin_action(
        db, admin.id, "delete_shoutout", "shoutout", shoutout_id,
        "Deleted shoutout permanently",
    )

    return {"message": "Shoutout deleted successfully", "deleted_shoutout_id": shoutout_id}


# ═══════════════════════════════════════════════════════════════════════════
#  AUDIT LOGS
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/logs", response_model=List[models.AuditLogResponse])
def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Get recent admin audit logs."""
    return service.get_audit_logs(db, limit)
