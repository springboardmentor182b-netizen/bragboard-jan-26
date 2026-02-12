from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.shoutouts.models import ShoutoutCreate, ShoutoutResponse
from src.shoutouts import service

router = APIRouter(prefix="/shoutouts", tags=["Shoutouts"])


@router.post("/", response_model=ShoutoutResponse, status_code=201)
def create_shoutout(
    data: ShoutoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new shoutout."""
    return service.create_shoutout(db, current_user.id, data)


@router.get("/", response_model=List[ShoutoutResponse])
def list_shoutouts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List shoutouts with pagination."""
    return service.get_all_shoutouts(db, skip, limit)


@router.get("/{shoutout_id}", response_model=ShoutoutResponse)
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
