"""
Entities Service
Business logic for shout-outs, comments, reactions, and reports
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from .shoutout import ShoutOut, ShoutOutRecipient, Report
from .comment import Comment
from .reaction import Reaction, ReactionType
class ShoutOutService:
    """Shout-out service with business logic"""
    
    @staticmethod
    def create_shoutout(
        db: Session,
        sender_id: int,
        message: str,
        recipient_ids: List[int]
    ) -> ShoutOut:
        """Create a new shout-out with recipients"""
        # Create shout-out
        shoutout = ShoutOut(sender_id=sender_id, message=message)
        db.add(shoutout)
        db.flush()  # Get shoutout.id without committing
        
        # Add recipients
        for recipient_id in recipient_ids:
            recipient = ShoutOutRecipient(
                shoutout_id=shoutout.id,
                recipient_id=recipient_id
            )
            db.add(recipient)
        
        db.commit()
        db.refresh(shoutout)
        return shoutout
    
    @staticmethod
    def get_all_shoutouts(db: Session, skip: int = 0, limit: int = 100) -> List[ShoutOut]:
        """Get all shout-outs with pagination"""
        return db.query(ShoutOut).order_by(desc(ShoutOut.created_at)).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_shoutout_by_id(db: Session, shoutout_id: int) -> Optional[ShoutOut]:
        """Get shout-out by ID"""
        return db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
    
    @staticmethod
    def delete_shoutout(db: Session, shoutout_id: int) -> bool:
        """Delete a shout-out"""
        shoutout = ShoutOutService.get_shoutout_by_id(db, shoutout_id)
        if not shoutout:
            return False
        
        db.delete(shoutout)
        db.commit()
        return True
    
    @staticmethod
    def get_shoutout_count(db: Session) -> int:
        """Get total shout-out count"""
        return db.query(ShoutOut).count()
    
    @staticmethod
    def get_top_contributors(db: Session, limit: int = 10) -> List[dict]:
        """Get users with most shout-outs given"""
        from src.users.models import User
        
        results = db.query(
            User.id,
            User.name,
            func.count(ShoutOut.id).label('shoutout_count')
        ).join(
            ShoutOut, User.id == ShoutOut.sender_id
        ).group_by(
            User.id, User.name
        ).order_by(
            desc('shoutout_count')
        ).limit(limit).all()
        
        return [
            {
                "user_id": user_id,
                "name": name,
                "shoutout_count": count
            }
            for user_id, name, count in results
        ]
    
    @staticmethod
    def get_most_tagged_users(db: Session, limit: int = 10) -> List[dict]:
        """Get users who received most shout-outs"""
        from src.users.models import User
        
        results = db.query(
            User.id,
            User.name,
            func.count(ShoutOutRecipient.id).label('received_count')
        ).join(
            ShoutOutRecipient, User.id == ShoutOutRecipient.recipient_id
        ).group_by(
            User.id, User.name
        ).order_by(
            desc('received_count')
        ).limit(limit).all()
        
        return [
            {
                "user_id": user_id,
                "name": name,
                "received_count": count
            }
            for user_id, name, count in results
        ]

class CommentService:
    """Comment service with business logic"""
    
    @staticmethod
    def create_comment(db: Session, shoutout_id: int, user_id: int, content: str) -> Comment:
        """Create a new comment"""
        comment = Comment(shoutout_id=shoutout_id, user_id=user_id, content=content)
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return comment
    
    @staticmethod
    def get_comments_by_shoutout(db: Session, shoutout_id: int) -> List[Comment]:
        """Get all comments for a shout-out"""
        return db.query(Comment).filter(Comment.shoutout_id == shoutout_id).order_by(Comment.created_at).all()
    
    @staticmethod
    def delete_comment(db: Session, comment_id: int) -> bool:
        """Delete a comment"""
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            return False
        
        db.delete(comment)
        db.commit()
        return True

class ReactionService:
    """Reaction service with business logic"""
    
    @staticmethod
    def add_reaction(db: Session, shoutout_id: int, user_id: int, reaction_type: ReactionType) -> Reaction:
        """Add a reaction to a shout-out"""
        # Check if user already reacted with this type
        existing = db.query(Reaction).filter(
            Reaction.shoutout_id == shoutout_id,
            Reaction.user_id == user_id,
            Reaction.type == reaction_type
        ).first()
        
        if existing:
            return existing  # Already reacted
        
        reaction = Reaction(shoutout_id=shoutout_id, user_id=user_id, type=reaction_type)
        db.add(reaction)
        db.commit()
        db.refresh(reaction)
        return reaction
    
    @staticmethod
    def remove_reaction(db: Session, shoutout_id: int, user_id: int, reaction_type: ReactionType) -> bool:
        """Remove a reaction"""
        reaction = db.query(Reaction).filter(
            Reaction.shoutout_id == shoutout_id,
            Reaction.user_id == user_id,
            Reaction.type == reaction_type
        ).first()
        
        if not reaction:
            return False
        
        db.delete(reaction)
        db.commit()
        return True
    
    @staticmethod
    def get_reaction_counts(db: Session, shoutout_id: int) -> dict:
        """Get reaction counts for a shout-out"""
        results = db.query(
            Reaction.type,
            func.count(Reaction.id).label('count')
        ).filter(
            Reaction.shoutout_id == shoutout_id
        ).group_by(Reaction.type).all()
        
        return {reaction_type.value: count for reaction_type, count in results}

class ReportService:
    """Report service with business logic"""
    
    @staticmethod
    def create_report(db: Session, shoutout_id: int, reported_by: int, reason: str) -> Report:
        """Create a new report for flagged content"""
        report = Report(shoutout_id=shoutout_id, reported_by=reported_by, reason=reason)
        db.add(report)
        db.commit()
        db.refresh(report)
        return report
    
    @staticmethod
    def get_all_reports(db: Session) -> List[Report]:
        """Get all reports"""
        return db.query(Report).order_by(desc(Report.created_at)).all()
    
    @staticmethod
    def delete_report(db: Session, report_id: int) -> bool:
        """Delete a report (after resolution)"""
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return False
        
        db.delete(report)
        db.commit()
        return True
