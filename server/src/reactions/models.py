from pydantic import BaseModel
from typing import Literal


class ReactionToggle(BaseModel):
    """Request body to toggle a reaction on a shoutout."""
    type: Literal["like", "clap", "star", "heart", "fire", "celebrate", "wow", "thumbsup", "rocket"]


class ReactionCountsResponse(BaseModel):
    """How many of each reaction type a shoutout has, plus the current user's reactions."""
    shoutout_id: int
    like: int = 0
    clap: int = 0
    star: int = 0
    heart: int = 0
    fire: int = 0
    celebrate: int = 0
    wow: int = 0
    thumbsup: int = 0
    rocket: int = 0
    user_reactions: list[str] = []