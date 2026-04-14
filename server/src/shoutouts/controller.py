from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from src.database.config import get_db
from src.shoutouts.service import ShoutoutService
from src.shoutouts.models import ShoutoutCreate, ShoutoutResponse, ShoutoutListResponse, ShoutoutFilter
from src.auth.dependencies import get_current_user
from src.entities.user import User

router = APIRouter()

@router.post("/", response_model=ShoutoutResponse, status_code=201)
def create_shoutout(
    data: ShoutoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    shoutout = ShoutoutService.create_shoutout(
        db, 
        current_user.id, 
        current_user.username, 
        data
    )
    recipient_ids = [r.recipient_id for r in shoutout.recipients]
    return {
        "id": shoutout.id,
        "sender_id": shoutout.sender_id,
        "sender_name": shoutout.sender_name,
        "department": shoutout.department,
        "message": shoutout.message,
        "created_at": shoutout.created_at,
        "recipient_ids": recipient_ids,
        "attachment_url": shoutout.attachment_url,
        "attachment_type": shoutout.attachment_type
    }

@router.get("/", response_model=ShoutoutListResponse)
def list_shoutouts(
    skip: int = 0,
    limit: int = 20,
    department: Optional[str] = Query(None, description="Filter by department"),
    sender_id: Optional[int] = Query(None, description="Filter by sender"),
    recipient_id: Optional[int] = Query(None, description="Filter by recipient"),
    start_date: Optional[datetime] = Query(None, description="Start date filter"),
    end_date: Optional[datetime] = Query(None, description="End date filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filters = ShoutoutFilter(
        department=department,
        sender_id=sender_id,
        recipient_id=recipient_id,
        start_date=start_date,
        end_date=end_date
    )
    total, shoutouts = ShoutoutService.get_all_shoutouts(db, skip, limit, filters)
    result = []
    for s in shoutouts:
        recipient_ids = [r.recipient_id for r in s.recipients]
        result.append({
            "id": s.id,
            "sender_id": s.sender_id,
            "sender_name": s.sender_name,
            "department": s.department,
            "message": s.message,
            "created_at": s.created_at,
            "recipient_ids": recipient_ids,
            "attachment_url": s.attachment_url,
            "attachment_type": s.attachment_type
        })
    return {"total": total, "shoutouts": result}

@router.get("/departments")
def get_departments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"departments": ShoutoutService.get_departments(db)}

@router.get("/{shoutout_id}", response_model=ShoutoutResponse)
def get_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    shoutout = ShoutoutService.get_shoutout_by_id(db, shoutout_id)
    recipient_ids = [r.recipient_id for r in shoutout.recipients]
    return {
        "id": shoutout.id,
        "sender_id": shoutout.sender_id,
        "sender_name": shoutout.sender_name,
        "department": shoutout.department,
        "message": shoutout.message,
        "created_at": shoutout.created_at,
        "recipient_ids": recipient_ids,
        "attachment_url": shoutout.attachment_url,
        "attachment_type": shoutout.attachment_type
    }

@router.delete("/{shoutout_id}")
def delete_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return ShoutoutService.delete_shoutout(db, shoutout_id)
