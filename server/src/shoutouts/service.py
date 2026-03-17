from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from src.entities.shoutout import Shoutout, ShoutoutRecipient, Tag, ShoutoutTag
from src.entities.user import User
from src.shoutouts.models import ShoutoutCreate
from typing import List

class ShoutoutService:
    @staticmethod
    def create_shoutout(db: Session, shoutout: ShoutoutCreate):
        # Create shoutout
        db_shoutout = Shoutout(
            sender_id=shoutout.sender_id,
            message=shoutout.message
        )
        db.add(db_shoutout)
        db.flush()
        
        # Add recipients
        for recipient_id in shoutout.recipient_ids:
            recipient = ShoutoutRecipient(
                shoutout_id=db_shoutout.id,
                recipient_id=recipient_id
            )
            db.add(recipient)
        
        # Add tags
        for tag_name in shoutout.tag_names:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                db.flush()
            
            shoutout_tag = ShoutoutTag(
                shoutout_id=db_shoutout.id,
                tag_id=tag.id
            )
            db.add(shoutout_tag)
        
        db.commit()
        db.refresh(db_shoutout)
        return db_shoutout
    
    @staticmethod
    def get_all_shoutouts(db: Session, skip: int = 0, limit: int = 20):
        return db.query(Shoutout).order_by(
            desc(Shoutout.created_at)
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_received_shoutouts(db: Session, user_id: int):
        return db.query(Shoutout).join(
            ShoutoutRecipient
        ).filter(
            ShoutoutRecipient.recipient_id == user_id
        ).order_by(desc(Shoutout.created_at)).all()
    
    @staticmethod
    def get_user_sent_shoutouts(db: Session, user_id: int):
        return db.query(Shoutout).filter(
            Shoutout.sender_id == user_id
        ).order_by(desc(Shoutout.created_at)).all()
    
    @staticmethod
    def get_dashboard_stats(db: Session, user_id: int):
        received = db.query(ShoutoutRecipient).filter(
            ShoutoutRecipient.recipient_id == user_id
        ).count()
        
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
        
        recent = db.query(Shoutout).order_by(
            desc(Shoutout.created_at)
        ).limit(10).all()
        
        return {
            "shoutouts_received": received,
            "shoutouts_given": given,
            "leaderboard_rank": rank,
            "recent_shoutouts": recent
        }
    
    @staticmethod
    def get_leaderboard(db: Session):
        leaderboard = db.query(
            User,
            func.count(ShoutoutRecipient.id).label('shoutout_count')
        ).join(
            ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id
        ).group_by(User.id).order_by(desc('shoutout_count')).all()
        
        return [{"user": user, "shoutouts": count} for user, count in leaderboard]
    
    @staticmethod
    def get_all_tags(db: Session):
        return db.query(Tag).all()