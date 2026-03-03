from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database.connection import get_db  # ← FIX: change from .. to src
from src.auth.dependencies import get_current_user  # ← ADD THIS
from src.entities.user import User  # ← ADD THIS
from .service import (
    get_top_contributors,
    get_most_appreciated,
    get_department_stats
)

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


# ENDPOINT 1: Top Contributors
@router.get("/top-contributors")
def leaderboard_top_contributors(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get users who sent the most shout-outs (requires authentication)."""
    return get_top_contributors(db, limit)


# ENDPOINT 2: Most Appreciated
@router.get("/most-appreciated")
@router.get("/top-appreciated")
def leaderboard_most_appreciated(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get users who received the most shout-outs (requires authentication)."""
    return get_most_appreciated(db, limit)


# ENDPOINT 3: Departments
@router.get("/departments")
def leaderboard_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get engagement statistics by department (requires authentication)."""
    return get_department_stats(db)