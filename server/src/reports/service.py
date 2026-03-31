from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from typing import Optional, List

from fastapi import HTTPException
from src.entities.report import Report
from src.entities.shoutout import Shoutout       # adjust import to your entity path
from src.reports.models import ReportCreate, ReportResolve


class AppException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class ReportService:

    # ── Employee: create a report ─────────────────────────────────────────────
    @staticmethod
    def create_report(db: Session, payload: ReportCreate, current_user_id: int) -> Report:
        # Validate shoutout exists
        shoutout = db.query(Shoutout).filter(Shoutout.id == payload.shoutout_id).first()
        if not shoutout:
            raise AppException(status_code=404, detail="Shoutout not found")

        # Prevent duplicate reports from same user
        duplicate = (
            db.query(Report)
            .filter(
                Report.shoutout_id == payload.shoutout_id,
                Report.reported_by == current_user_id,
            )
            .first()
        )
        if duplicate:
            raise AppException(status_code=400, detail="You have already reported this shoutout")

        report = Report(
            shoutout_id=payload.shoutout_id,
            reported_by=current_user_id,
            reason=payload.reason,
            status="pending",
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    # ── Admin: list all reports ───────────────────────────────────────────────
    @staticmethod
    def get_all_reports(db: Session, status_filter: Optional[str] = None) -> List[Report]:
        query = db.query(Report).options(
            joinedload(Report.shoutout),
            joinedload(Report.reporter),
        )
        if status_filter and status_filter in ("pending", "resolved", "dismissed"):
            query = query.filter(Report.status == status_filter)
        return query.order_by(Report.created_at.desc()).all()

    # ── Admin: resolve / dismiss a report ────────────────────────────────────
    @staticmethod
    def resolve_report(
        db: Session, report_id: int, payload: ReportResolve, admin_id: int
    ) -> Report:
        if payload.action not in ("resolved", "dismissed"):
            raise AppException(status_code=422, detail="action must be 'resolved' or 'dismissed'")

        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise AppException(status_code=404, detail="Report not found")
        if report.status != "pending":
            raise AppException(status_code=400, detail="Report already actioned")

        report.status = payload.action
        report.resolved_by = admin_id
        report.resolved_at = datetime.utcnow()

        db.commit()
        db.refresh(report)
        return report

    # ── Admin: delete shoutout + resolve report ───────────────────────────────
    @staticmethod
    def delete_reported_shoutout(db: Session, report_id: int, admin_id: int) -> None:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise AppException(status_code=404, detail="Report not found")

        shoutout = db.query(Shoutout).filter(Shoutout.id == report.shoutout_id).first()
        if shoutout:
            db.delete(shoutout)

        report.status = "resolved"
        report.resolved_by = admin_id
        report.resolved_at = datetime.utcnow()

        db.commit()