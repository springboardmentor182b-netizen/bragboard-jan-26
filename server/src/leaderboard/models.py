"""
Leaderboard Pydantic Schemas
Defines the shape of the API response data.
Same pattern as src/reports/models.py in this project.
"""

from pydantic import BaseModel
from typing import List


class LeaderboardEntry(BaseModel):
    """One employee row returned by the leaderboard API."""
    id: int
    name: str
    department: str
    score: int          # shout-outs sent / received / reactions given

    class Config:
        from_attributes = True


class LeaderboardResponse(BaseModel):
    period: str
    entries: List[LeaderboardEntry]
