from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.comments.models import CommentCreate, CommentResponse
from src.comments import service

router = APIRouter(tags=["Comments"])


@router.post("/shoutouts/{shoutout_id}/comments", response_model=CommentResponse, status_code=201)
def add_comment(
    shoutout_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a comment to a shoutout."""
    return service.create_comment(db, shoutout_id, current_user.id, data.content)


@router.get("/shoutouts/{shoutout_id}/comments", response_model=List[CommentResponse])
def list_comments(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List comments on a shoutout."""
    return service.get_comments_for_shoutout(db, shoutout_id)


@router.delete("/comments/{comment_id}", status_code=204)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a comment (owner or admin)."""
    service.delete_comment(db, comment_id, current_user.id, current_user.role)
