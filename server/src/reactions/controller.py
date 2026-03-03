from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.auth.service import get_current_user
from src.entities.user import User
from src.reactions.models import ReactionCreate, ReactionResponse
from src.reactions import service

router = APIRouter(tags=["Reactions"])


@router.post("/shoutouts/{shoutout_id}/reactions", response_model=ReactionResponse, status_code=201)
def toggle_reaction(
    shoutout_id: int,
    data: ReactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle a reaction on a shoutout. If it already exists, it will be removed (returns 204)."""
    result = service.toggle_reaction(db, shoutout_id, current_user.id, data.type)
    if result is None:
        from fastapi.responses import Response
        return Response(status_code=204)
    return result


@router.get("/shoutouts/{shoutout_id}/reactions", response_model=List[ReactionResponse])
def list_reactions(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all reactions on a shoutout."""
    return service.get_reactions_for_shoutout(db, shoutout_id)
