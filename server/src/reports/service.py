from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.entities.report import Report


def create_report(db: Session, reported_by: int, shoutout_id: int, reason: str) -> Report:
    report = Report(shoutout_id=shoutout_id, reported_by=reported_by, reason=reason)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_all_reports(db: Session) -> List[Report]:
    return db.query(Report).order_by(Report.created_at.desc()).all()


def delete_report(db: Session, report_id: int) -> None:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    db.delete(report)
    db.commit()
