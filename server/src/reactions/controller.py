from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.entities.shoutout import Shoutout
from src.reactions.models import ReactionCreate, ReactionCountsResponse
from src.reactions import service
from src.notifications import service as notification_service

router = APIRouter(tags=["Reactions"])


@router.post("/shoutouts/{shoutout_id}/reactions", status_code=201)
def toggle_reaction(
    shoutout_id: int,
    body: ReactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Toggle a reaction on a shoutout. 
    Supports 9 reaction types: like, clap, star, heart, fire, celebrate, wow, thumbsup, rocket
    Calling twice removes it.
    
    Creates notification for shoutout owner when reaction is added.
    """
    try:
        result = service.toggle_reaction(db, shoutout_id, current_user.id, body.type)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Create notification if reaction was added (not removed)
    if result["added"]:
        try:
            # Get the shoutout to find its owner
            shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
            if shoutout and shoutout.sender_id != current_user.id:
                notification_service.create_reaction_notification(
                    db=db,
                    shoutout_id=shoutout_id,
                    shoutout_owner_id=shoutout.sender_id,
                    reactor_id=current_user.id,
                    reactor_name=current_user.name,
                    reaction_type=body.type
                )
        except Exception as e:
            # Don't fail reaction if notification fails
            print(f"Warning: Failed to create reaction notification: {e}")

    # Return fresh counts after toggle
    counts = service.get_reaction_counts(db, shoutout_id, current_user.id)
    return {**result, "counts": counts}


@router.get("/shoutouts/{shoutout_id}/reactions")
def list_reactions(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get reaction counts + current user's reactions for a shoutout."""
    return service.get_reaction_counts(db, shoutout_id, current_user.id)
