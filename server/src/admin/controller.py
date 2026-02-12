from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.admin.models import AdminLogResponse
from src.admin import service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/logs", response_model=List[AdminLogResponse])
def list_admin_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all admin action logs (admin only)."""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return service.get_all_admin_logs(db)
