from typing import List

from sqlalchemy.orm import Session

from src.entities.admin_log import AdminLog


def get_all_admin_logs(db: Session) -> List[AdminLog]:
    return db.query(AdminLog).order_by(AdminLog.timestamp.desc()).all()


def create_admin_log(
    db: Session,
    admin_id: int,
    action: str,
    target_id: int = None,
    target_type: str = None,
) -> AdminLog:
    log = AdminLog(
        admin_id=admin_id,
        action=action,
        target_id=target_id,
        target_type=target_type,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
