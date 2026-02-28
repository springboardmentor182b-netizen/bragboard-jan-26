from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db

# Import the specific classes from your entity files
from src.entities.shoutout import Shoutout
from src.entities.report import Report

router = APIRouter()

@router.get('/stats')
def get_admin_stats(db: Session = Depends(get_db)):
    # Since User.py is empty, we only count Shoutouts and Reports
    shoutout_count = db.query(Shoutout).count()
    report_count = db.query(Report).count()
    return {
        'users': "N/A", 
        'shoutouts': shoutout_count, 
        'reports': report_count
    }

@router.get('/reports')
def get_reports(db: Session = Depends(get_db)):
    # Join Report and Shoutout manually since there is no 'relationship' defined
    results = db.query(Report, Shoutout).join(Shoutout, Report.shoutout_id == Shoutout.id).all()
    
    formatted_data = []
    for report, shoutout in results:
        formatted_data.append({
            "id": report.id,
            "sender_name": shoutout.sender, # Uses the 'sender' column from Shoutout
            "content": shoutout.content,
            "reason": report.reason
        })
    return formatted_data

@router.delete('/reports/{report_id}')
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}