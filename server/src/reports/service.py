from sqlalchemy.orm import Session
from datetime import datetime
from .models import Report
from src.entities.models import Shoutout# Adjust if path different


def get_all_reports(db: Session):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    result = []

    for report in reports:
        shoutout = report.shoutout
        reporting_user = report.user

        result.append({
            "id": report.id,
            "reason": report.reason,
            "details": report.details,
            "reported_by_name": (reporting_user.full_name if reporting_user and reporting_user.full_name else f"User {report.user_id}"),
            "created_at": report.created_at.isoformat() if report.created_at else datetime.utcnow().isoformat(),
            "shoutout": {
                "id": shoutout.id,
                "sender_name": (shoutout.sender.full_name if shoutout.sender and shoutout.sender.full_name else "Unknown Sender"),
                "sender_initial": (shoutout.sender.full_name[0] if shoutout.sender and shoutout.sender.full_name else "U"),
                "recipient_name": (shoutout.recipient.full_name if shoutout.recipient and shoutout.recipient.full_name else "Unknown Recipient"),
                "content": shoutout.content or "No content.",
                "created_at": (shoutout.created_at.isoformat() if shoutout.created_at else datetime.utcnow().isoformat())
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



def create_report(db, shoutout_id: int, reported_by: str, reason: str):

    report = Report(
        shoutout_id=shoutout_id,
        user_id=reported_by,
        reason=reason
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report