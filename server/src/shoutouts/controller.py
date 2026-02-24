from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.shoutouts import service, models

router = APIRouter(prefix="/shoutouts", tags=["Shoutouts"])


@router.post("/", response_model=models.ShoutoutResponse, status_code=201)
def create_shoutout(
    data: models.ShoutoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new shoutout."""
    return service.create_shoutout(db, current_user.id, data)


@router.get("/", response_model=List[models.ShoutoutResponse])
def list_shoutouts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List shoutouts with pagination."""
    return service.get_all_shoutouts(db, skip, limit)


@router.get("/{shoutout_id}", response_model=models.ShoutoutResponse)
def get_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single shoutout by ID."""
    return service.get_shoutout_by_id(db, shoutout_id)


@router.delete("/{shoutout_id}", status_code=204)
def delete_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a shoutout (owner or admin)."""
    service.delete_shoutout(db, shoutout_id, current_user.id, current_user.role)


@router.get("/my/{user_id}", response_model=List[models.ShoutoutResponse])
def read_my_shoutouts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_my_shoutouts(db, user_id)


@router.get("/leaderboard", response_model=List[models.LeaderboardEntry])
def read_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_leaderboard(db)


@router.get("/departments", response_model=List[models.DepartmentStat])
def read_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_department_stats(db)


@router.put("/{id}/like", response_model=models.ShoutoutResponse)
def like_shoutout(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.like_shoutout(db, id)
