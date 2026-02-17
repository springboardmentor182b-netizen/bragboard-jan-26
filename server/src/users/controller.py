from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from src.database.connection import get_db
from src.users import service
from src.users.models import (
    EmployeeDashboardResponse,
    ShoutOutFeedResponse,
    LeaderboardResponse,
)

router = APIRouter()


@router.get("/employee/{user_id}", response_model=EmployeeDashboardResponse)
def get_employee_dashboard(user_id: int, db: Session = Depends(get_db)):
    result = service.get_employee_dashboard(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return result


@router.get("/employees")
def get_all_employees(db: Session = Depends(get_db)):
    return service.get_all_employees(db)


@router.get("/feed", response_model=ShoutOutFeedResponse)
def get_shoutout_feed(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    department: Optional[str] = Query(default=None),
    sender_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
):
    return service.get_shoutout_feed(
        db, page=page, page_size=page_size,
        department=department, sender_id=sender_id,
    )


@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_leaderboard(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return service.get_leaderboard(db, limit=limit)
