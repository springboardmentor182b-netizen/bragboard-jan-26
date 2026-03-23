from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db

# Import the specific classes from your entity files
from src.entities.shoutout import Shoutout
from src.entities.report import Report

router = APIRouter()

# --- 1. GET ALL SHOUTOUTS (The Management List) ---
@router.get('/shoutouts')
def get_all_shoutouts(db: Session = Depends(get_db)):
    # Fetch every shoutout from the database
    shoutouts = db.query(Shoutout).all()
    
    # Format them for the frontend table
    return [
        {
            "id": s.id,
            "sender_name": s.sender,
            "receiver_id": s.receiver_id,
            "content": s.content,
            "created_at": s.created_at if hasattr(s, 'created_at') else None
        } for s in shoutouts
    ]

# --- 2. GET REPORTED POSTS (Moderation View) ---
@router.get('/reports')
def get_reports(db: Session = Depends(get_db)):
    results = db.query(Report, Shoutout).join(Shoutout, Report.shoutout_id == Shoutout.id).all()
    
    formatted_data = []
    for report, shoutout in results:
        formatted_data.append({
            "id": report.id,
            "shoutout_id": shoutout.id,
            "sender_name": shoutout.sender,
            "receiver_name": shoutout.receiver, # Ensure your Shoutout model has 'receiver'
            "content": shoutout.content,
            "reason": report.reason
        })
    return formatted_data

# --- 3. DELETE A SHOUTOUT ---
@router.delete('/shoutouts/{shoutout_id}')
def delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    
    # Note: If there are reports linked to this shoutout, 
    # you might need to delete those first or use 'cascade delete' in your model.
    db.delete(shoutout)
    db.commit()
    return {"message": "Success! Shoutout deleted."}

# --- 4. DELETE A REPORT ---
@router.delete('/reports/{report_id}')
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    db.delete(report)
    db.commit()
    return {"message": "Success! Report deleted."}