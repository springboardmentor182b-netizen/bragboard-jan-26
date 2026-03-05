from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime, timezone
from src.database.connection import get_db
from src.entities.user import User, UserRole, UserStatus
from src.auth.dependencies import get_current_user, get_current_admin

router = APIRouter()


# ==================== PYDANTIC MODELS ====================

class ApprovalRequest(BaseModel):
    """Request model for approving or rejecting a user"""
    user_id: int
    approved: bool
    rejection_reason: str | None = None


class PendingUserResponse(BaseModel):
    """Response model for pending user data"""
    id: int
    name: str
    email: str
    department: str
    joined_at: datetime
    status: str

    class Config:
        from_attributes = True


class UserStatsResponse(BaseModel):
    """Statistics about user accounts"""
    total_users: int
    pending_users: int
    approved_users: int
    rejected_users: int
    suspended_users: int


# ==================== ADMIN ENDPOINTS (must come BEFORE /{user_id}) ===========
# ─── FIX 7: Route ordering — /admin/* must be declared BEFORE /{user_id} ──────
# FastAPI evaluates routes in registration order. If /{user_id} is declared
# first, a request to /users/admin/pending would fail with a 422 (FastAPI tries
# to coerce "admin" to int and fails) before it ever reaches the correct route.
# Moving all static /admin/* routes above /{user_id} ensures clean matching.

@router.get("/admin/pending", response_model=List[PendingUserResponse], tags=["Admin"])
def get_pending_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Get all users pending approval - ADMIN ONLY
    Sorted by registration date (newest first).
    """
    pending_users = db.query(User).filter(
        User.status == UserStatus.pending
    ).order_by(User.joined_at.desc()).all()

    return [
        PendingUserResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            department=u.department or "Not Specified",
            joined_at=u.joined_at,
            status=u.status.value
        )
        for u in pending_users
    ]


@router.get("/admin/all-users", tags=["Admin"])
def get_all_users_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
    status_filter: str | None = None
):
    """
    Get ALL users with their approval status - ADMIN ONLY
    Optional query parameter: status (pending, approved, rejected, suspended)
    """
    query = db.query(User)

    if status_filter:
        # ─── FIX 8: UserStatus[status_filter] raises KeyError for wrong case ──
        # e.g. ?status=Pending (capital P) caused an unhandled 500.
        # Normalise to lowercase before the lookup.
        try:
            status_enum = UserStatus[status_filter.lower()]
            query = query.filter(User.status == status_enum)
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Valid options: pending, approved, rejected, suspended",
            )

    users = query.order_by(User.joined_at.desc()).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "department": u.department or "Not Specified",
            "role": u.role.value,
            "status": u.status.value,
            "joined_at": u.joined_at.isoformat(),
            "approved_at": u.approved_at.isoformat() if u.approved_at else None,
            "approved_by": u.approved_by,
            "rejection_reason": u.rejection_reason,
        }
        for u in users
    ]


@router.post("/admin/approve", tags=["Admin"])
def approve_or_reject_user(
    request: ApprovalRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Approve or reject a pending user - ADMIN ONLY
    - approved: true  → approve the user (they can now login)
    - approved: false → reject (rejection_reason required)
    """
    user = db.query(User).filter(User.id == request.user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.status != UserStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User is already {user.status.value}. Only pending users can be approved or rejected.",
        )

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot approve your own account",
        )

    try:
        if request.approved:
            user.status = UserStatus.approved
            user.approved_by = current_admin.id
            # ─── FIX 9: datetime.utcnow() deprecated in Python 3.12 ──────────
            user.approved_at = datetime.now(timezone.utc)
            user.rejection_reason = None
            message = f"User '{user.name}' ({user.email}) has been approved successfully"
        else:
            if not request.rejection_reason or not request.rejection_reason.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Rejection reason is required when rejecting a user",
                )
            user.status = UserStatus.rejected
            user.rejection_reason = request.rejection_reason.strip()
            user.approved_by = None
            user.approved_at = None
            message = f"User '{user.name}' ({user.email}) has been rejected"

        db.commit()
        db.refresh(user)

        return {
            "success": True,
            "message": message,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "status": user.status.value,
                "approved_by": user.approved_by,
                "approved_at": user.approved_at.isoformat() if user.approved_at else None,
                "rejection_reason": user.rejection_reason,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user status: {str(e)}",
        )


@router.put("/admin/suspend/{user_id}", tags=["Admin"])
def suspend_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Suspend an approved user - ADMIN ONLY"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot suspend your own account",
        )

    if user.status == UserStatus.suspended:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User is already suspended"
        )

    if user.role == UserRole.admin:
        admin_count = db.query(User).filter(
            User.role == UserRole.admin, User.status == UserStatus.approved
        ).count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot suspend the last admin. Promote another user to admin first.",
            )

    try:
        user.status = UserStatus.suspended
        db.commit()
        return {
            "success": True,
            "message": f"User '{user.name}' has been suspended",
            "user_id": user.id,
            "status": user.status.value,
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to suspend user: {str(e)}",
        )


@router.put("/admin/reactivate/{user_id}", tags=["Admin"])
def reactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Reactivate a suspended user - ADMIN ONLY"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.status != UserStatus.suspended:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only suspended users can be reactivated",
        )

    try:
        user.status = UserStatus.approved
        user.approved_by = current_admin.id
        # ─── FIX 9 (continued): datetime.utcnow() deprecated ─────────────────
        user.approved_at = datetime.now(timezone.utc)
        db.commit()
        return {
            "success": True,
            "message": f"User '{user.name}' has been reactivated",
            "user_id": user.id,
            "status": user.status.value,
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reactivate user: {str(e)}",
        )


@router.get("/admin/stats", response_model=UserStatsResponse, tags=["Admin"])
def get_user_statistics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get statistics about user accounts - ADMIN ONLY"""
    return UserStatsResponse(
        total_users=db.query(User).count(),
        pending_users=db.query(User).filter(User.status == UserStatus.pending).count(),
        approved_users=db.query(User).filter(User.status == UserStatus.approved).count(),
        rejected_users=db.query(User).filter(User.status == UserStatus.rejected).count(),
        suspended_users=db.query(User).filter(User.status == UserStatus.suspended).count(),
    )


# ==================== USER ENDPOINTS (parameterised routes LAST) ==============

@router.get("/", tags=["Users"])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all APPROVED users (requires authentication).
    Used to populate recipient dropdown in Create Shoutout modal.
    """
    users = db.query(User).filter(
        User.status == UserStatus.approved
    ).order_by(User.name).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "department": u.department or "General",
            "role": u.role.value if u.role else "employee",
        }
        for u in users
    ]


@router.get("/{user_id}", tags=["Users"])
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single user by ID (requires authentication)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if current_user.role != UserRole.admin and user.status != UserStatus.approved:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "department": user.department or "General",
        "role": user.role.value if user.role else "employee",
        "status": user.status.value,
    }