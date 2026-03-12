from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.moderation import service
from src.moderation.models import (
    ModerationNoteCreate,
    ModerationNoteResponse,
    RejectShoutoutRequest,
)

router = APIRouter(prefix="/moderation", tags=["Moderation"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Guard: only admins may proceed."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.post("/notes", response_model=ModerationNoteResponse, status_code=201)
def add_note(
    data: ModerationNoteCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Add a moderation thread note to a shoutout."""
    note = service.add_note(db, admin.id, data.shoutout_id, data.message)
    return {
        "id": note.id,
        "shoutout_id": note.shoutout_id,
        "admin_id": note.admin_id,
        "admin_name": admin.name,
        "message": note.message,
        "created_at": note.created_at,
    }


@router.get("/notes/{shoutout_id}", response_model=List[ModerationNoteResponse])
def get_notes(
    shoutout_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Get all moderation thread notes for a shoutout."""
    return service.get_notes_for_shoutout(db, shoutout_id)


@router.post("/accept/{shoutout_id}")
def accept_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Accept a shoutout — clears all reports."""
    return service.accept_shoutout(db, admin.id, shoutout_id)


@router.post("/reject/{shoutout_id}")
def reject_shoutout(
    shoutout_id: int,
    body: RejectShoutoutRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Reject and delete a shoutout with a reason."""
    return service.reject_shoutout(db, admin.id, shoutout_id, body.reason)
