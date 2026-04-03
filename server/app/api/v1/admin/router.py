from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db

# Import the specific classes from your entity files
from src.entities.shoutout import Shoutout
from src.entities.report import Report
from src.entities.user import User  # <--- ADDED THIS IMPORT

# --- IMPORT the leaderboard router from Group C ---
from app.api.v1.admin.leaderboard import router as leaderboard_router
router = APIRouter()

# --- 1. GET ALL SHOUTOUTS (The Management List) ---
@router.get('/shoutouts')
def get_all_shoutouts(db: Session = Depends(get_db)):
    shoutouts = db.query(Shoutout).all()
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
            "receiver_name": shoutout.receiver if hasattr(shoutout, 'receiver') else "Unknown",
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

# --- 5. LEADERBOARD ROUTER ---
router.include_router(leaderboard_router.router, prefix="/leaderboard", tags=["leaderboard"])

# --- 6. USER MANAGEMENT (New Section for Screenshot 2) ---

@router.get('/users')
def get_all_user(db: Session = Depends(get_db)):
    """Fetches the user list for the Admin User Management table."""
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "department": u.department if hasattr(u, 'department') else "N/A",
            "role": u.role if hasattr(u, 'role') else "employee",
            "status": u.status if hasattr(u, 'status') else "active",
            "joined_date": u.joined_date.strftime("%Y-%m-%d") if hasattr(u, 'joined_date') and u.joined_date else "2026-01-01"
        } for u in users
    ]

@router.delete('/users/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Allows Admin to delete a user (The Trash Can icon in SS2)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}