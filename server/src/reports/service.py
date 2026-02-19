from sqlalchemy.orm import Session
from .models import Report


def get_all_reports(db: Session):
    return db.query(Report).all()


def resolve_report(db: Session, report_id: int):
    report = db.query(Report).filter(Report.id == report_id).first()
    if report:
        db.delete(report)
        db.commit()
    return {"message": "Report resolved successfully"}


def delete_shoutout(db: Session, shoutout_id: int):
    reports = db.query(Report).filter(
        Report.shoutout_id == shoutout_id
    ).all()

    for report in reports:
        db.delete(report)

    db.commit()
    return {"message": "Shoutout deleted successfully"}
