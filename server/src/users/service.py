from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from src.users.models import User
from src.entities.shoutout import Shoutout, ShoutoutRecipient, ShoutoutTag, Tag
from src.users.schemas import UserCreate
from typing import List

class UserService:
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        db_user = User(**user.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def get_all_users(db: Session):
        return db.query(User).all()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_stats(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        # Count received shoutouts
        received = db.query(ShoutoutRecipient).filter(
            ShoutoutRecipient.recipient_id == user_id
        ).count()
        
        # Count sent shoutouts
        given = db.query(Shoutout).filter(
            Shoutout.sender_id == user_id
        ).count()
        
        # Get leaderboard rank
        leaderboard = db.query(
            User.id,
            func.count(ShoutoutRecipient.id).label('count')
        ).join(
            ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id
        ).group_by(User.id).order_by(desc('count')).all()
        
        rank = next((idx + 1 for idx, (uid, _) in enumerate(leaderboard) if uid == user_id), 0)
        
        # Get top tags
        top_tags = db.query(
            Tag.name,
            func.count(ShoutoutTag.id).label('count')
        ).join(ShoutoutTag).join(Shoutout).join(
            ShoutoutRecipient, Shoutout.id == ShoutoutRecipient.shoutout_id
        ).filter(
            ShoutoutRecipient.recipient_id == user_id
        ).group_by(Tag.name).order_by(desc('count')).limit(4).all()
        
        top_tags_list = [{"name": name, "count": count} for name, count in top_tags]
        
        return {
            "user": user,
            "shoutouts_received": received,
            "shoutouts_given": given,
            "leaderboard_rank": rank,
            "top_tags": top_tags_list
        }
