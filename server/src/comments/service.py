from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.entities.comment import Comment


def create_comment(db: Session, shoutout_id: int, user_id: int, content: str) -> Comment:
    comment = Comment(shoutout_id=shoutout_id, user_id=user_id, content=content)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def get_comments_for_shoutout(db: Session, shoutout_id: int) -> List[Comment]:
    return db.query(Comment).filter(Comment.shoutout_id == shoutout_id).order_by(Comment.created_at.asc()).all()


def delete_comment(db: Session, comment_id: int, user_id: int, user_role: str) -> None:
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.user_id != user_id and user_role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(comment)
    db.commit()
