from sqlalchemy.orm import Session
from sqlalchemy import func
from src.entities.shoutout import ShoutOut
from src.entities.report import Report
from src.entities.admin_log import AdminLog
from fastapi import HTTPException

HARMFUL_REPORT_THRESHOLD = 3

class AdminService:
    @staticmethod
    def _with_report_counts(db, shoutouts):
        result = []
        for s in shoutouts:
            count = db.query(Report).filter(Report.shoutout_id == s.id).count()
            result.append({
                "id": s.id,
                "sender_id": s.sender_id,
                "message": s.message,
                "created_at": s.created_at,
                "report_count": count,
                "is_flagged": count >= HARMFUL_REPORT_THRESHOLD
            })
        return result

    @staticmethod
    def get_all_shoutouts_admin(db: Session, skip=0, limit=20):
        total = db.query(ShoutOut).count()
        shoutouts = db.query(ShoutOut).offset(skip).limit(limit).all()
        return total, AdminService._with_report_counts(db, shoutouts)

    @staticmethod
    def get_reported_shoutouts(db: Session, skip=0, limit=20):
        ids = db.query(Report.shoutout_id).distinct().subquery()
        total = db.query(ShoutOut).filter(ShoutOut.id.in_(ids)).count()
        shoutouts = db.query(ShoutOut).filter(ShoutOut.id.in_(ids)).offset(skip).limit(limit).all()
        return total, AdminService._with_report_counts(db, shoutouts)

    @staticmethod
    def get_harmful_shoutouts(db: Session, skip=0, limit=20):
        ids = db.query(Report.shoutout_id).group_by(Report.shoutout_id).having(
            func.count(Report.id) >= HARMFUL_REPORT_THRESHOLD
        ).subquery()
        total = db.query(ShoutOut).filter(ShoutOut.id.in_(ids)).count()
        shoutouts = db.query(ShoutOut).filter(ShoutOut.id.in_(ids)).offset(skip).limit(limit).all()
        return total, AdminService._with_report_counts(db, shoutouts)

    @staticmethod
    def admin_delete_shoutout(db: Session, admin_id: int, shoutout_id: int):
        s = db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
        if not s:
            raise HTTPException(status_code=404, detail="Shoutout not found")
        db.add(AdminLog(
            admin_id=admin_id,
            action="DELETE_SHOUTOUT",
            target_id=shoutout_id,
            target_type="shoutout"
        ))
        db.delete(s)
        db.commit()
        return {"detail": "Shoutout deleted and action logged"}

    @staticmethod
    def get_admin_logs(db: Session, skip=0, limit=50):
        logs = db.query(AdminLog).order_by(AdminLog.timestamp.desc()).offset(skip).limit(limit).all()
        total = db.query(AdminLog).count()
        return total, logs
