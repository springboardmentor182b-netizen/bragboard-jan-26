from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.dependencies import get_current_user
from src.entities.user import User, UserRole
from src.comments.models import CommentCreate, CommentResponse
from src.comments import service

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/{shoutout_id}", response_model=CommentResponse, status_code=201)
def post_comment(
    shoutout_id: int,
    body: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Add a comment (or reply) to a shoutout.
    Pass parent_id in the body to reply to an existing top-level comment.
    """
    return service.add_comment(
        db,
        shoutout_id,
        current_user.id,
        body.content,
        body.parent_id,
    )


@router.get("/{shoutout_id}", response_model=List[CommentResponse])
def list_comments(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all top-level comments for a shoutout, each with their replies.
    Any authenticated user can read comments.
    """
    return service.get_comments(db, shoutout_id)


@router.delete("/{comment_id}", status_code=204)
def remove_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a comment. Authors can delete their own; admins can delete any."""
    is_admin = current_user.role == UserRole.admin
    service.delete_comment(db, comment_id, current_user.id, is_admin)