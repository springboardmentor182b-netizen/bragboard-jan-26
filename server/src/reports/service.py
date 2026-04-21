from sqlalchemy.orm import Session
from src.entities.report import Report
from src.reports.models import ReportCreate
from fastapi import HTTPException

class ReportService:
    @staticmethod
    def create_report(db: Session, reported_by: int, data: ReportCreate):
        existing = db.query(Report).filter(
            Report.shoutout_id == data.shoutout_id,
            Report.reported_by == reported_by
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="You have already reported this shoutout")
        report = Report(shoutout_id=data.shoutout_id, reported_by=reported_by, reason=data.reason)
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def get_all_reports(db: Session, skip: int = 0, limit: int = 20):
        return db.query(Report).count(), db.query(Report).offset(skip).limit(limit).all()

    @staticmethod
    def resolve_report(db: Session, report_id: int):
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        report.resolved = True
        db.commit()
        db.refresh(report)
        return report
