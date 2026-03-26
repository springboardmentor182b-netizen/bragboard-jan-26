from typing import List, Optional

from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from src.entities.comment import Comment
from src.entities.shoutout import Shoutout


def add_comment(
    db: Session,
    shoutout_id: int,
    user_id: int,
    content: str,
    parent_id: Optional[int] = None,
) -> Comment:
    """Post a new comment (or reply) on a shoutout."""
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

    # Validate parent_id — must belong to same shoutout and be top-level
    if parent_id is not None:
        parent = db.query(Comment).filter(Comment.id == parent_id).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent comment not found.",
            )
        if parent.shoutout_id != shoutout_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent comment does not belong to this shoutout.",
            )
        # Only one level of nesting allowed — replies cannot be replied to
        if parent.parent_id is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Replies to replies are not supported. Reply to the top-level comment instead.",
            )

    comment = Comment(
        shoutout_id=shoutout_id,
        user_id=user_id,
        content=content,
        parent_id=parent_id,
    )
    db.add(comment)
    db.commit()

    # Reload with all relationships
    return (
        db.query(Comment)
        .options(
            joinedload(Comment.user),
            joinedload(Comment.replies).joinedload(Comment.user),
        )
        .filter(Comment.id == comment.id)
        .first()
    )


def get_comments(db: Session, shoutout_id: int) -> List[Comment]:
    """
    Return top-level comments for a shoutout (oldest first),
    each with their replies eagerly loaded.
    """
    return (
        db.query(Comment)
        .options(
            joinedload(Comment.user),
            joinedload(Comment.replies).joinedload(Comment.user),
        )
        .filter(
            Comment.shoutout_id == shoutout_id,
            Comment.parent_id.is_(None),   # top-level only
        )
        .order_by(Comment.created_at.asc())
        .all()
    )


def get_comment_count(db: Session, shoutout_id: int) -> int:
    """Return total comment count (all levels) for a shoutout."""
    return db.query(Comment).filter(Comment.shoutout_id == shoutout_id).count()


def delete_comment(db: Session, comment_id: int, user_id: int, is_admin: bool) -> None:
    """
    Delete a comment — only the author or an admin may do this.
    Deleting a top-level comment cascades to its replies via DB FK.
    """
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