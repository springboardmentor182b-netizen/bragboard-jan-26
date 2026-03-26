from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.dependencies import get_current_user
from src.entities.user import User
from src.reactions.models import ReactionToggle, ReactionCountsResponse
from src.reactions import service

router = APIRouter(prefix="/reactions", tags=["Reactions"])


@router.post("/{shoutout_id}/toggle")
def toggle_reaction(
    shoutout_id: int,
    body: ReactionToggle,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle a reaction (like/clap/star) on a shoutout. Calling twice removes it."""
    try:
        result = service.toggle_reaction(db, shoutout_id, current_user.id, body.type)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Return fresh counts after toggle
    counts = service.get_reaction_counts(db, shoutout_id, current_user.id)
    return {**result, "counts": counts}


@router.get("/{shoutout_id}", response_model=ReactionCountsResponse)
def get_reactions(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get reaction counts + current user's reactions for a shoutout."""
    return service.get_reaction_counts(db, shoutout_id, current_user.id)
