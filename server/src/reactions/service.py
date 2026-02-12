from typing import List, Optional

from sqlalchemy.orm import Session

from src.entities.reaction import Reaction


def toggle_reaction(db: Session, shoutout_id: int, user_id: int, reaction_type: str) -> Optional[Reaction]:
    """Toggle a reaction: if it exists, remove it and return None; otherwise create it."""
    existing = (
        db.query(Reaction)
        .filter(
            Reaction.shoutout_id == shoutout_id,
            Reaction.user_id == user_id,
            Reaction.type == reaction_type,
        )
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
        return None

    reaction = Reaction(shoutout_id=shoutout_id, user_id=user_id, type=reaction_type)
    db.add(reaction)
    db.commit()
    db.refresh(reaction)
    return reaction


def get_reactions_for_shoutout(db: Session, shoutout_id: int) -> List[Reaction]:
    return db.query(Reaction).filter(Reaction.shoutout_id == shoutout_id).all()
