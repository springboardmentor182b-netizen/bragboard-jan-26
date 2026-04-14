from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from src.entities.shoutout import ShoutOut
from src.entities.shoutout_recipient import ShoutOutRecipient
from src.entities.user import User
from src.shoutouts.models import ShoutoutCreate, ShoutoutFilter
from fastapi import HTTPException
from datetime import datetime

class ShoutoutService:
    @staticmethod
    def create_shoutout(db: Session, sender_id: int, sender_name: str, data: ShoutoutCreate):
        shoutout = ShoutOut(
            sender_id=sender_id,
            sender_name=sender_name,
            department=data.department,
            message=data.message,
            attachment_url=data.attachment_url,
            attachment_type=data.attachment_type
        )
        db.add(shoutout)
        db.flush()
        for recipient_id in data.recipient_ids:
            db.add(ShoutOutRecipient(shoutout_id=shoutout.id, recipient_id=recipient_id))
        db.commit()
        db.refresh(shoutout)
        return shoutout

    @staticmethod
    def get_all_shoutouts(db: Session, skip: int = 0, limit: int = 20, filters: ShoutoutFilter = None):
        query = db.query(ShoutOut)
        
        if filters:
            if filters.department:
                query = query.filter(ShoutOut.department == filters.department)
            if filters.sender_id:
                query = query.filter(ShoutOut.sender_id == filters.sender_id)
            if filters.start_date:
                query = query.filter(ShoutOut.created_at >= filters.start_date)
            if filters.end_date:
                query = query.filter(ShoutOut.created_at <= filters.end_date)
            if filters.recipient_id:
                # Join with recipients to filter by recipient
                query = query.join(ShoutOutRecipient).filter(
                    ShoutOutRecipient.recipient_id == filters.recipient_id
                )
        
        # Order by most recent first
        query = query.order_by(ShoutOut.created_at.desc())
        
        total = query.count()
        shoutouts = query.offset(skip).limit(limit).all()
        return total, shoutouts

    @staticmethod
    def get_shoutout_by_id(db: Session, shoutout_id: int):
        s = db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
        if not s:
            raise HTTPException(status_code=404, detail="Shoutout not found")
        return s

    @staticmethod
    def delete_shoutout(db: Session, shoutout_id: int):
        s = ShoutoutService.get_shoutout_by_id(db, shoutout_id)
        db.delete(s)
        db.commit()
        return {"detail": "Shoutout deleted successfully"}

    @staticmethod
    def get_departments(db: Session):
        departments = db.query(ShoutOut.department).distinct().filter(
            ShoutOut.department.isnot(None)
        ).all()
        return [d[0] for d in departments if d[0]]
