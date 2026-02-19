from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.db import SessionLocal
from . import service

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/admin/reports/")
def get_reports(db: Session = Depends(get_db)):
    return service.get_all_reports(db)


@router.post("/admin/reports/{report_id}/resolve")
def resolve_report(report_id: int, db: Session = Depends(get_db)):
    return service.resolve_report(db, report_id)


@router.delete("/admin/reports/shoutout/{shoutout_id}")
def delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    return service.delete_shoutout(db, shoutout_id)
