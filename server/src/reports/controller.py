from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.database import get_db
from src.entities import models, schemas
from src.reports import service

router = APIRouter(tags=["Reports"])

# --- Admin Endpoints ---

@router.get("/admin/reports")
def get_reports(db: Session = Depends(get_db)):
    return service.get_all_reports(db)

@router.post("/admin/reports/{report_id}/resolve")
def resolve_report(report_id: int, db: Session = Depends(get_db)):
    return service.resolve_report(db, report_id)

@router.delete("/admin/reports/shoutout/{shoutout_id}")
def delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    return service.delete_shoutout(db, shoutout_id)

# --- User Endpoints ---

@router.post("/reports/", response_model=schemas.Report)
def create_report(report: schemas.ReportCreate, user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_shoutout = db.query(models.ShoutOut).filter(models.ShoutOut.id == report.shoutout_id).first()
    if not db_shoutout:
        raise HTTPException(status_code=404, detail="ShoutOut not found")

    db_report = models.Report(
        reason=report.reason,
        details=report.details,
        user_id=user_id,
        shoutout_id=report.shoutout_id
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.get("/reports/reasons")
def get_report_reasons():
    return [
        "Inappropriate Content",
        "Spam or Misleading",
        "Harassment or Bullying",
        "Offensive Language",
        "Other"
    ]

