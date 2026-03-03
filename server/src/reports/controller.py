from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.database import get_db
from src.entities import models, schemas

router = APIRouter(tags=["Reports"])

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

@router.get("/reasons")
def get_report_reasons():
    return [
        "Inappropriate Content",
        "Spam or Misleading",
        "Harassment or Bullying",
        "Offensive Language",
        "Other"
    ]
