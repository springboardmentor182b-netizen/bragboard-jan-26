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
    limit: int = Query(10, ge=1, le=50, description="Number of results to return"),
    db: Session = Depends(get_db)
):
    """
    Get users who sent the most shout-outs
    
    Returns leaderboard of top contributors sorted by number of shout-outs sent
    """
    return get_top_contributors(db, limit)


@router.get("/top-appreciated")
def leaderboard_most_appreciated(
    limit: int = Query(10, ge=1, le=50, description="Number of results to return"),
    db: Session = Depends(get_db)
):
    """
    Get users who received the most shout-outs
    
    Returns leaderboard of most appreciated employees sorted by shout-outs received
    """
    return get_most_appreciated(db, limit)

@router.get("/departments")
def leaderboard_departments(db: Session = Depends(get_db)):
    """
    Get engagement statistics by department
    
    Returns shout-out counts and engagement metrics for each department
    """
    return get_department_stats(db)
