from typing import List, Optional

from sqlalchemy.orm import Session

from src.entities.reaction import Reaction

# ENHANCED: Expanded from 3 to 9 reaction types!
VALID_TYPES = {
    "like",      # 👍 Classic like
    "clap",      # 👏 Appreciation
    "star",      # ⭐ Favorite
    "heart",     # ❤️ Love it
    "fire",      # 🔥 Fire/Hot
    "celebrate", # 🎉 Celebration
    "wow",       # 😮 Amazing
    "thumbsup",  # 👍 Thumbs up
    "rocket",    # 🚀 Going far
}


def toggle_reaction(db: Session, shoutout_id: int, user_id: int, reaction_type: str) -> dict:
    """
    Toggle a reaction on a shoutout for a user.
    - If the user hasn't reacted with this type → add it (return added=True)
    - If they already have → remove it (return added=False)
    
    Supports 9 reaction types: like, clap, star, heart, fire, celebrate, wow, thumbsup, rocket
    """
    if reaction_type not in VALID_TYPES:
        raise ValueError(f"Invalid reaction type: {reaction_type}. Must be one of: {', '.join(VALID_TYPES)}")

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

    reaction = Reaction(shoutout_id=shoutout_id, user_id=user_id, type=reaction_type)
    db.add(reaction)
    db.commit()
    db.refresh(reaction)
    return {"added": True, "type": reaction_type}


def get_reaction_counts(db: Session, shoutout_id: int, user_id: int) -> dict:
    """Return reaction counts per type + which types the current user has used."""
    reactions = db.query(Reaction).filter(Reaction.shoutout_id == shoutout_id).all()

    # Initialize counts for all reaction types
    counts = {rtype: 0 for rtype in VALID_TYPES}
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
        sid: {
            "shoutout_id": sid,
            **{rtype: 0 for rtype in VALID_TYPES},
            "user_reactions": []
        }
        for sid in shoutout_ids
    }

    for r in reactions:
        if r.shoutout_id in result and r.type in VALID_TYPES:
            result[r.shoutout_id][r.type] += 1
            if r.user_id == user_id:
                result[r.shoutout_id]["user_reactions"].append(r.type)

    return result
