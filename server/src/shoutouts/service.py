from sqlalchemy.orm import Session
from src.entities.shoutout import Shoutout
from src.entities.tag import Tag
from src.entities.comment import Comment
from src.entities.user import User
from src.schemas.shoutout import ShoutoutCreate, CommentCreate
from src.schemas.user import User as UserSchema

def create_shoutout(db: Session, shoutout: ShoutoutCreate, sender_id: int):
    # Handle tags
    db_tags = []
    for tag_name in shoutout.tags:
        db_tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not db_tag:
            db_tag = Tag(name=tag_name)
            db.add(db_tag)
            db.commit() # Commit to get ID
            db.refresh(db_tag)
        db_tags.append(db_tag)

    # Handle recipients
    db_recipients = db.query(User).filter(User.id.in_(shoutout.recipient_ids)).all()

    db_shoutout = Shoutout(
        content=shoutout.content,
        sender_id=sender_id,
        tags=db_tags,
        recipients=db_recipients
    )
    db.add(db_shoutout)
    db.commit()
    db.refresh(db_shoutout)
    return db_shoutout

def get_shoutouts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Shoutout).order_by(Shoutout.created_at.desc()).offset(skip).limit(limit).all()

def create_comment(db: Session, comment: CommentCreate, shoutout_id: int, user_id: int):
    db_comment = Comment(
        content=comment.content,
        shoutout_id=shoutout_id,
        user_id=user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
