from sqlalchemy.orm import Session
from src.entities.report import Report
from src.entities.shoutout import Shoutout

def get_all_reports(db: Session):
    """Returns all reported shoutouts for the admin to view"""
    return db.query(Report).all()

def delete_shoutout(db: Session, shoutout_id: int):
    """Deletes the post and all associated reports from the database"""
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if shoutout:
        # Also clean up any reports linked to this shoutout
        db.query(Report).filter(Report.shoutout_id == shoutout_id).delete()
        db.delete(shoutout)
        db.commit()
        return True
    return False

def resolve_report(db: Session, report_id: int):
    """Removes the report flag without deleting the post"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if report:
        db.delete(report)
        db.commit()
        return True
    return False

def create_report(db: Session, shoutout_id: int, reason: str):
    """Creates a new report entry in the database"""
    new_report = Report(shoutout_id=shoutout_id, reason=reason)
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report