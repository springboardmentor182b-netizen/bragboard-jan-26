from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db # Adjust based on your database setup
from src.admin import service

router = APIRouter(prefix="/admin", tags=["Admin Moderation"])

@router.get("/reports")
def view_reports(db: Session = Depends(get_db)):
    # Only admins should access this route [cite: 95]
    return service.get_all_reports(db)

@router.delete("/shoutouts/{shoutout_id}")
def remove_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    # Deletes problematic content [cite: 73]
    success = service.delete_shoutout(db, shoutout_id)
    if not success:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return {"message": "Shoutout deleted successfully"}