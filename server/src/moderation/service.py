from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.entities.moderation_note import ModerationNote
from src.entities.report import Report
from src.entities.shoutout import Shoutout
from src.admin.service import log_admin_action


def add_note(db: Session, admin_id: int, shoutout_id: int, message: str) -> ModerationNote:
    """Create a moderation thread note on a shoutout."""
    # Verify shoutout exists
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")

    note = ModerationNote(
        shoutout_id=shoutout_id,
        admin_id=admin_id,
        message=message,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def get_notes_for_shoutout(db: Session, shoutout_id: int) -> List[dict]:
    """Return all moderation notes for a shoutout, oldest first."""
    notes = (
        db.query(ModerationNote)
        .filter(ModerationNote.shoutout_id == shoutout_id)
        .order_by(ModerationNote.created_at.asc())
        .all()
    )
    return [
        {
            "id": n.id,
            "shoutout_id": n.shoutout_id,
            "admin_id": n.admin_id,
            "admin_name": n.admin.name if n.admin else "Unknown",
            "message": n.message,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notes
    ]


def accept_shoutout(db: Session, admin_id: int, shoutout_id: int) -> dict:
    """Accept a shoutout by clearing all its reports."""
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")

    deleted_count = db.query(Report).filter(Report.shoutout_id == shoutout_id).delete()
    db.commit()

    log_admin_action(db, admin_id, f"Accepted shoutout (cleared {deleted_count} reports)", shoutout_id, "shoutout")

    return {"message": "Shoutout accepted", "reports_cleared": deleted_count}


def reject_shoutout(db: Session, admin_id: int, shoutout_id: int, reason: str) -> dict:
    """Reject a shoutout: delete it and log the rejection reason."""
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")

    db.delete(shoutout)
    db.commit()

    log_admin_action(db, admin_id, f"Rejected shoutout — Reason: {reason}", shoutout_id, "shoutout")

    return {"message": "Shoutout rejected and deleted", "shoutout_id": shoutout_id}
