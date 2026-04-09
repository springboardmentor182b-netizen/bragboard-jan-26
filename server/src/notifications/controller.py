from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.database.connection import get_db
from src.auth.dependencies import get_current_user
from src.entities.user import User
from src.notifications import service
from src.notifications.models import NotificationResponse, UnreadCountResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    unread_only: bool = False,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get notifications for the current user.
    
    Query params:
    - unread_only: If true, only return unread notifications
    - limit: Maximum number of notifications to return (default 50)
    """
    notifications = service.get_user_notifications(
        db, 
        current_user.id, 
        unread_only=unread_only,
        limit=limit
    )
    
    return notifications


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get count of unread notifications for the current user."""
    count = service.get_unread_count(db, current_user.id)
    return {"unread_count": count}


@router.patch("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a specific notification as read."""
    notification = service.mark_notification_as_read(
        db, 
        notification_id, 
        current_user.id
    )
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {
        "success": True,
        "message": "Notification marked as read",
        "notification_id": notification_id
    }


@router.post("/mark-all-read")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all notifications as read for the current user."""
    count = service.mark_all_as_read(db, current_user.id)
    
    return {
        "success": True,
        "message": f"Marked {count} notification(s) as read",
        "count": count
    }


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a specific notification."""
    deleted = service.delete_notification(
        db, 
        notification_id, 
        current_user.id
    )
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {
        "success": True,
        "message": "Notification deleted",
        "notification_id": notification_id
    }