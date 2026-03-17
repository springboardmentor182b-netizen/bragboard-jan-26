from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.config import get_db
from src.entities.shoutout import Comment
from pydantic import BaseModel
from typing import List

router = APIRouter()

class CommentCreate(BaseModel):
    shoutout_id: int
    user_id: int
    content: str

class CommentResponse(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    content: str
    created_at: str

    class Config:
        from_attributes = True

@router.post("/comments", response_model=CommentResponse)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = Comment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/shoutouts/{shoutout_id}/comments", response_model=List[CommentResponse])
def get_comments(shoutout_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.shoutout_id == shoutout_id).all()
    return comments

@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
