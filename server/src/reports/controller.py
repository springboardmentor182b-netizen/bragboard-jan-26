from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional

from src.database.config import get_db
from src.reports.models import ReportCreate, ReportResponse, ReportResolve
from src.reports.service import ReportService
from src.auth.controller import get_current_user, require_admin  # match your existing auth pattern
from src.users.models import User

router = APIRouter()  # ← NO prefix here, it's set in main.py as "/api/reports"


# ── Employee: report a shoutout ───────────────────────────────────────────────
@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def report_shoutout(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService.create_report(db, payload, current_user.id)


# ── Admin: get all reports (filter by status) ─────────────────────────────────
@router.get("/admin", response_model=List[ReportResponse])
def get_all_reports(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return ReportService.get_all_reports(db, status_filter)


# ── Admin: resolve or dismiss a report ───────────────────────────────────────
@router.patch("/admin/{report_id}/resolve", response_model=ReportResponse)
def resolve_report(
    report_id: int,
    payload: ReportResolve,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return ReportService.resolve_report(db, report_id, payload, current_user.id)


# ── Admin: delete shoutout tied to a report ───────────────────────────────────
@router.delete("/admin/{report_id}/delete-shoutout", status_code=status.HTTP_204_NO_CONTENT)
def delete_reported_shoutout(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    ReportService.delete_reported_shoutout(db, report_id, current_user.id)