from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.config import get_db
from src.reports.service import ReportService
from src.reports.models import ReportCreate, ReportResponse, ReportListResponse
from src.auth.dependencies import get_current_user
from src.entities.user import User

router = APIRouter()

@router.post("/", response_model=ReportResponse, status_code=201)
def report_shoutout(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = ReportService.create_report(db, current_user.id, data)
    return report

@router.get("/", response_model=ReportListResponse)
def list_reports(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    total, reports = ReportService.get_all_reports(db, skip, limit)
    return {"total": total, "reports": reports}

@router.patch("/{report_id}/resolve", response_model=ReportResponse)
def resolve_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return ReportService.resolve_report(db, report_id)
