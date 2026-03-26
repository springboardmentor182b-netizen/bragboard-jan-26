from pydantic import BaseModel
from typing import Literal


class ReactionToggle(BaseModel):
    """Request body to toggle a reaction on a shoutout."""
    type: Literal["like", "clap", "star"]


class ReactionCountsResponse(BaseModel):
    """How many of each reaction type a shoutout has, plus the current user's reactions."""
    shoutout_id: int
    like: int = 0
    clap: int = 0
    star: int = 0
    user_reactions: list[str] = []  # e.g. ["like", "star"] — types the current user has set
