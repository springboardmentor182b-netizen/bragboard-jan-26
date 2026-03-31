"""
Leaderboard Service
Database query logic for leaderboard.
Uses existing entity models already in this project:
  - src/users/models.py      → User
  - src/entities/shoutout.py → ShoutOut, ShoutOutRecipient
  - src/entities/reaction.py → Reaction

Same pattern as src/reports/service.py in this project.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.users.models import User
from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.reaction import Reaction


def _get_start_date(period: str):
    """Return start datetime for filtering, or None for all time."""
    now = datetime.utcnow()
    if period == "weekly":
        return now - timedelta(weeks=1)
    if period == "monthly":
        return now - timedelta(days=30)
    return None


class LeaderboardService:

    @staticmethod
    def get_top_senders(db: Session, period: str = "monthly", limit: int = 10):
        """Employees who SENT the most shout-outs."""
        start_date = _get_start_date(period)
        query = (
            db.query(
                User.id,
                User.name,
                User.department,
                func.count(ShoutOut.id).label("score"),
            )
            .join(ShoutOut, ShoutOut.sender_id == User.id)
        )
        if start_date:
            query = query.filter(ShoutOut.created_at >= start_date)
        rows = (
            query.group_by(User.id, User.name, User.department)
            .order_by(func.count(ShoutOut.id).desc())
            .limit(limit).all()
        )
        return [{"id": r.id, "name": r.name, "department": r.department, "score": r.score} for r in rows]

    @staticmethod
    def get_most_recognised(db: Session, period: str = "monthly", limit: int = 10):
        """Employees who RECEIVED the most shout-outs."""
        start_date = _get_start_date(period)
        query = (
            db.query(
                User.id,
                User.name,
                User.department,
                func.count(ShoutOutRecipient.id).label("score"),
            )
            .join(ShoutOutRecipient, ShoutOutRecipient.recipient_id == User.id)
            .join(ShoutOut, ShoutOut.id == ShoutOutRecipient.shoutout_id)
        )
        if start_date:
            query = query.filter(ShoutOut.created_at >= start_date)
        rows = (
            query.group_by(User.id, User.name, User.department)
            .order_by(func.count(ShoutOutRecipient.id).desc())
            .limit(limit).all()
        )
        return [{"id": r.id, "name": r.name, "department": r.department, "score": r.score} for r in rows]

    @staticmethod
    def get_top_reactors(db: Session, period: str = "monthly", limit: int = 10):
        """Employees who gave the most reactions."""
        start_date = _get_start_date(period)
        query = (
            db.query(
                User.id,
                User.name,
                User.department,
                func.count(Reaction.id).label("score"),
            )
            .join(Reaction, Reaction.user_id == User.id)
            .join(ShoutOut, ShoutOut.id == Reaction.shoutout_id)
        )
        if start_date:
            query = query.filter(ShoutOut.created_at >= start_date)
        rows = (
            query.group_by(User.id, User.name, User.department)
            .order_by(func.count(Reaction.id).desc())
            .limit(limit).all()
        )
        return [{"id": r.id, "name": r.name, "department": r.department, "score": r.score} for r in rows]
