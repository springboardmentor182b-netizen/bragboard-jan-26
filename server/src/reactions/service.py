from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from src.entities.reaction import Reaction


VALID_TYPES = {"like", "clap", "star"}


def toggle_reaction(db: Session, shoutout_id: int, user_id: int, reaction_type: str) -> dict:
    """
    Toggle a reaction (like / clap / star) on a shoutout for a user.
    - If the user hasn't reacted with this type → add it (return added=True)
    - If they already have → remove it (return added=False)
    """
    if reaction_type not in VALID_TYPES:
        raise ValueError(f"Invalid reaction type: {reaction_type}")

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
        return {"added": False, "type": reaction_type}
    else:
        reaction = Reaction(shoutout_id=shoutout_id, user_id=user_id, type=reaction_type)
        db.add(reaction)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            # Race condition — already exists, so treat as toggle-off
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
            return {"added": False, "type": reaction_type}
        return {"added": True, "type": reaction_type}


def get_reaction_counts(db: Session, shoutout_id: int, user_id: int) -> dict:
    """Return reaction counts per type + which types the current user has used."""
    reactions = db.query(Reaction).filter(Reaction.shoutout_id == shoutout_id).all()

    counts = {"like": 0, "clap": 0, "star": 0}
    user_reactions = []

    for r in reactions:
        if r.type in counts:
            counts[r.type] += 1
        if r.user_id == user_id:
            user_reactions.append(r.type)

    return {
        "shoutout_id": shoutout_id,
        **counts,
        "user_reactions": user_reactions,
    }


def get_bulk_reaction_counts(db: Session, shoutout_ids: list[int], user_id: int) -> dict:
    """
    Efficiently fetch reaction data for multiple shoutouts at once.
    Returns a dict keyed by shoutout_id.
    """
    if not shoutout_ids:
        return {}

    reactions = (
        db.query(Reaction)
        .filter(Reaction.shoutout_id.in_(shoutout_ids))
        .all()
    )

    result = {
        sid: {"shoutout_id": sid, "like": 0, "clap": 0, "star": 0, "user_reactions": []}
        for sid in shoutout_ids
    }

    for r in reactions:
        if r.shoutout_id in result and r.type in ("like", "clap", "star"):
            result[r.shoutout_id][r.type] += 1
            if r.user_id == user_id:
                result[r.shoutout_id]["user_reactions"].append(r.type)

    return result
