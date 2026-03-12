from sqlalchemy.orm import Session
from .models import Report
from src.entities.shoutout import Shoutout # Adjust if path different


def get_all_reports(db: Session):
    reports = db.query(Report).all()
    result = []

    for report in reports:
        shoutout = db.query(Shoutout).filter(
            Shoutout.id == report.shoutout_id
        ).first()

        result.append({
            "id": report.id,
            "reason": report.reason,
            "reported_by": report.reported_by,
            "created_at": report.created_at,
            "shoutout": {
                "id": shoutout.id,
                "sender": shoutout.sender,
                "receiver": shoutout.receiver,
                "message": shoutout.message,
                "created_at": shoutout.created_at
            } if shoutout else None
        })

    return result


def resolve_report(db: Session, report_id: int):
    report = db.query(Report).filter(Report.id == report_id).first()
    if report:
        db.delete(report)
        db.commit()
        return {"message": "Report resolved"}
    return {"message": "Report not found"}


def delete_shoutout(db: Session, shoutout_id: int):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if shoutout:
        db.delete(shoutout)
        db.commit()
        return {"message": "Shoutout deleted"}
    return {"message": "Shoutout not found"}

from src.reports.models import Report


def create_report(db, shoutout_id: int, reported_by: str, reason: str):

    report = Report(
        shoutout_id=shoutout_id,
        reported_by=reported_by,
        reason=reason
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report