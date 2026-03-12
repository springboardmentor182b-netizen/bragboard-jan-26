from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.reports.models import Report
from src.entities.shoutout import Shoutout
from src.users.models import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ----------------------------
# REPORT MODERATION
# ----------------------------

@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()


@router.post("/reports/{report_id}/resolve")
def resolve_report(report_id: int, db: Session = Depends(get_db)):

    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if report:
        db.delete(report)
        db.commit()

    return {"message": "Report resolved"}


@router.delete("/reports/shoutout/{shoutout_id}")
def delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):

    shoutout = db.query(Shoutout).filter(
        Shoutout.id == shoutout_id
    ).first()

    if shoutout:
        db.delete(shoutout)
        db.commit()

    return {"message": "Shoutout deleted"}


# ----------------------------
# ACCOUNT MANAGEMENT
# ----------------------------

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/users/count")
def get_total_users(db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count()
    }


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user:
        db.delete(user)
        db.commit()

    return {"message": "User deleted"}