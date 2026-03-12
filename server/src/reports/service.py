from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.entities.report import Report


def create_report(db: Session, reported_by: int, shoutout_id: int, reason: str) -> Report:
    """Submit a new report for a shoutout."""
    # Prevent duplicate reports from same user on same shoutout
    existing = (
        db.query(Report)
        .filter(Report.shoutout_id == shoutout_id, Report.reported_by == reported_by)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already reported this shoutout.",
        )

    report = Report(shoutout_id=shoutout_id, reported_by=reported_by, reason=reason)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_all_reports(db: Session) -> List[Report]:
    """Return all reports ordered by newest first."""
    return db.query(Report).order_by(Report.created_at.desc()).all()


def delete_report(db: Session, report_id: int) -> None:
    """Resolve/dismiss a report by deleting it."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    db.delete(report)
    db.commit()
