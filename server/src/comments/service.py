from typing import List

from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from src.entities.comment import Comment
from src.entities.shoutout import Shoutout


def add_comment(db: Session, shoutout_id: int, user_id: int, content: str) -> Comment:
    """Post a new comment on a shoutout."""
    content = content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comment cannot be empty.",
        )

    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shoutout not found.",
        )

    comment = Comment(shoutout_id=shoutout_id, user_id=user_id, content=content)
    db.add(comment)
    db.commit()

    # Reload with user relationship
    return (
        db.query(Comment)
        .options(joinedload(Comment.user))
        .filter(Comment.id == comment.id)
        .first()
    )


def get_comments(db: Session, shoutout_id: int) -> List[Comment]:
    """Return all comments for a shoutout, oldest first."""
    return (
        db.query(Comment)
        .options(joinedload(Comment.user))
        .filter(Comment.shoutout_id == shoutout_id)
        .order_by(Comment.created_at.asc())
        .all()
    )


def delete_comment(db: Session, comment_id: int, user_id: int, is_admin: bool) -> None:
    """Delete a comment — only the author or an admin may do this."""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found.",
        )
    if not is_admin and comment.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comments.",
        )
    db.delete(comment)
    db.commit()
