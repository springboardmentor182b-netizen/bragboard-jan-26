from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.config import get_db
from src.admin.service import AdminService
from src.admin.models import AdminShoutoutListResponse, AdminLogListResponse
from src.auth.dependencies import get_current_user
from src.entities.user import User

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user

@router.get("/shoutouts", response_model=AdminShoutoutListResponse)
def admin_all_shoutouts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total, shoutouts = AdminService.get_all_shoutouts_admin(db, skip, limit)
    return {"total": total, "shoutouts": shoutouts}

@router.get("/shoutouts/reported", response_model=AdminShoutoutListResponse)
def admin_reported(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total, shoutouts = AdminService.get_reported_shoutouts(db, skip, limit)
    return {"total": total, "shoutouts": shoutouts}

@router.get("/shoutouts/harmful", response_model=AdminShoutoutListResponse)
def admin_harmful(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total, shoutouts = AdminService.get_harmful_shoutouts(db, skip, limit)
    return {"total": total, "shoutouts": shoutouts}

@router.delete("/shoutouts/{shoutout_id}")
def admin_delete(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return AdminService.admin_delete_shoutout(db, current_user.id, shoutout_id)

@router.get("/logs", response_model=AdminLogListResponse)
def admin_logs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total, logs = AdminService.get_admin_logs(db, skip, limit)
    return {"total": total, "logs": logs}
