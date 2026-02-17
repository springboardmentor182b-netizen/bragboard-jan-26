from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database.connection import get_db
from .service import (
    get_top_contributors,
    get_most_appreciated,
    get_department_stats
)

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("/top-contributors")
def leaderboard_top_contributors(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get users who sent the most shout-outs."""
    return get_top_contributors(db, limit)


@router.get("/most-appreciated")  # ← matches what frontend calls
@router.get("/top-appreciated")   # ← keep old name too for backwards compat
def leaderboard_most_appreciated(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get users who received the most shout-outs."""
    return get_most_appreciated(db, limit)


@router.get("/departments")
def leaderboard_departments(db: Session = Depends(get_db)):
    """Get engagement statistics by department."""
    return get_department_stats(db)
