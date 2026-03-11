"""
Leaderboard Controller
FastAPI router — same pattern as src/reports/controller.py.
NO prefix here. Prefix "/api/leaderboard" is set in main.py.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Literal

from src.database.connection import get_db
from src.leaderboard.models import LeaderboardEntry
from src.leaderboard.service import LeaderboardService

router = APIRouter()  # NO prefix — it is added in main.py

PeriodType = Literal["weekly", "monthly", "alltime"]


@router.get("/top-senders", response_model=List[LeaderboardEntry])
def top_senders(
    period: PeriodType = Query(default="monthly"),
    db: Session = Depends(get_db),
):
    """Top 10 employees who sent the most shout-outs."""
    return LeaderboardService.get_top_senders(db, period)


@router.get("/most-recognised", response_model=List[LeaderboardEntry])
def most_recognised(
    period: PeriodType = Query(default="monthly"),
    db: Session = Depends(get_db),
):
    """Top 10 employees who received the most shout-outs."""
    return LeaderboardService.get_most_recognised(db, period)


@router.get("/top-reactors", response_model=List[LeaderboardEntry])
def top_reactors(
    period: PeriodType = Query(default="monthly"),
    db: Session = Depends(get_db),
):
    """Top 10 employees who gave the most reactions."""
    return LeaderboardService.get_top_reactors(db, period)
