from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.entities.shoutout import Shoutout
from src.admin import service 

router = APIRouter(prefix="/shoutouts", tags=["shoutouts"])

# 1. This allows you to create a post (to have something to delete/report)
@router.post("/")
def create_test_shoutout(sender: str, receiver: str, content: str, db: Session = Depends(get_db)):
    new_shoutout = Shoutout(sender=sender, receiver=receiver, content=content)
    db.add(new_shoutout)
    db.commit()
    db.refresh(new_shoutout)
    return new_shoutout

# 2. This allows you to report a post (sending it to the Admin Panel)
@router.post("/{shoutout_id}/report")
def report_shoutout(shoutout_id: int, reason: str, db: Session = Depends(get_db)):
    """
    Endpoint for users to report a specific shoutout.
    """
    try:
        return service.create_report(db, shoutout_id, reason)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))