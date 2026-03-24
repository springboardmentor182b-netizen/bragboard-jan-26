from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db

# Import the specific classes from your entity files
from src.entities.shoutout import Shoutout
from src.entities.report import Report

# --- NEW: Import the leaderboard router ---
from app.api.v1.admin.leaderboard import router as leaderboard_router

router = APIRouter()

@router.get('/reports')
def get_reports(db: Session = Depends(get_db)):
    # Join Report and Shoutout to get the message and the sender/receiver
    results = db.query(Report, Shoutout).join(Shoutout, Report.shoutout_id == Shoutout.id).all()
    
    formatted_data = []
    for report, shoutout in results:
        formatted_data.append({
            "id": report.id,
            "sender_name": shoutout.sender,
            "receiver_name": shoutout.receiver,
            "content": shoutout.content,
            "reason": report.reason
        })
    return formatted_data

@router.delete('/reports/{report_id}')
def delete_report(report_id: int, db: Session = Depends(get_db)):
    # Find the report by its ID
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    
    return {"message": "Success! Report deleted."}

# --- NEW: Include the leaderboard router at the bottom ---
router.include_router(leaderboard_router.router, prefix="/leaderboard", tags=["leaderboard"])