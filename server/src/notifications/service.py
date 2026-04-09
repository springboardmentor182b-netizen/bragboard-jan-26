from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Optional

from src.entities.notification import Notification
from src.entities.user import User


def create_shoutout_notification(
    db: Session,
    shoutout_id: int,
    recipient_ids: List[int],
    sender_id: int,
    sender_name: str,
    message_preview: str
) -> List[Notification]:
    """
    Create notifications for all recipients of a shoutout.
    Returns list of created notifications.
    """
    notifications = []
    
    # Truncate message preview if too long
    preview = message_preview[:100] + "..." if len(message_preview) > 100 else message_preview
    
    for recipient_id in recipient_ids:
        # Don't notify yourself
        if recipient_id == sender_id:
            continue
            
        notification = Notification(
            user_id=recipient_id,
            type="shoutout_received",
            title="🎉 You received a shoutout!",
            message=f"{sender_name} shouted you out: \"{preview}\"",
            shoutout_id=shoutout_id,
            from_user_id=sender_id,
            is_read=False,
            created_at=datetime.utcnow()
        )
        db.add(notification)
        notifications.append(notification)
    
    try:
        db.commit()
        for notif in notifications:
            db.refresh(notif)
    except Exception as e:
        db.rollback()
        raise e
    
    return notifications


def create_reaction_notification(
    db: Session,
    shoutout_id: int,
    shoutout_owner_id: int,
    reactor_id: int,
    reactor_name: str,
    reaction_type: str
) -> Optional[Notification]:
    """
    Create notification when someone reacts to your shoutout.
    Returns created notification or None if owner is reactor.
    """
    # Don't notify yourself
    if shoutout_owner_id == reactor_id:
        return None
    
    # Map reaction types to emojis
    emoji_map = {
        "like": "👍",
        "clap": "👏",
        "star": "⭐",
        "heart": "❤️",
        "fire": "🔥",
        "celebrate": "🎉",
        "wow": "😮",
        "thumbsup": "👍",
        "rocket": "🚀",
    }
    
    emoji = emoji_map.get(reaction_type, "👍")
    
    notification = Notification(
        user_id=shoutout_owner_id,
        type="reaction_added",
        title=f"{emoji} New reaction on your shoutout",
        message=f"{reactor_name} reacted with {emoji} to your shoutout",
        shoutout_id=shoutout_id,
        from_user_id=reactor_id,
        is_read=False,
        created_at=datetime.utcnow()
    )
    
    db.add(notification)
    try:
        db.commit()
        db.refresh(notification)
    except Exception as e:
        db.rollback()
        raise e
    
    return notification


def create_comment_notification(
    db: Session,
    shoutout_id: int,
    shoutout_owner_id: int,
    commenter_id: int,
    commenter_name: str,
    comment_preview: str
) -> Optional[Notification]:
    """
    Create notification when someone comments on your shoutout.
    Returns created notification or None if owner is commenter.
    """
    # Don't notify yourself
    if shoutout_owner_id == commenter_id:
        return None
    
    # Truncate comment preview
    preview = comment_preview[:80] + "..." if len(comment_preview) > 80 else comment_preview
    
    notification = Notification(
        user_id=shoutout_owner_id,
        type="comment_added",
        title="💬 New comment on your shoutout",
        message=f"{commenter_name} commented: \"{preview}\"",
        shoutout_id=shoutout_id,
        from_user_id=commenter_id,
        is_read=False,
        created_at=datetime.utcnow()
    )
    
    db.add(notification)
    try:
        db.commit()
        db.refresh(notification)
    except Exception as e:
        db.rollback()
        raise e
    
    return notification


def get_user_notifications(
    db: Session,
    user_id: int,
    unread_only: bool = False,
    limit: int = 50
) -> List[Notification]:
    """
    Get notifications for a user.
    Returns most recent first.
    """
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    notifications = (
        query
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )
    
    return notifications


def mark_notification_as_read(db: Session, notification_id: int, user_id: int) -> Optional[Notification]:
    """
    Mark a notification as read.
    Returns updated notification or None if not found/not owned by user.
    """
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        )
        .first()
    )
    
    if not notification:
        return None
    
    if not notification.is_read:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.commit()
        db.refresh(notification)
    
    return notification


def mark_all_as_read(db: Session, user_id: int) -> int:
    """
    Mark all notifications as read for a user.
    Returns count of notifications marked.
    """
    count = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        .update({
            "is_read": True,
            "read_at": datetime.utcnow()
        })
    )
    
    db.commit()
    return count


def get_unread_count(db: Session, user_id: int) -> int:
    """
    Get count of unread notifications for a user.
    """
    count = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        .count()
    )
    
    return count


def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    """
    Delete a notification.
    Returns True if deleted, False if not found/not owned by user.
    """
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        )
        .first()
    )
    
    if not notification:
        return False
    
    db.delete(notification)
    db.commit()
    return True