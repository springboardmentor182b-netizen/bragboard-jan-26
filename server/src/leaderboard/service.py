"""
Leaderboard Service
Database query logic for leaderboard.
"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.users.models import User
# ✅ Import Reaction from shoutout.py to avoid duplicate model conflict
from src.entities.shoutout import Shoutout, ShoutoutRecipient, Reaction

def _get_start_date(period: str):
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
                func.count(Shoutout.id).label("score"),
            )
            .join(Shoutout, Shoutout.sender_id == User.id)
        )
        if start_date:
            query = query.filter(Shoutout.created_at >= start_date)
        rows = (
            query.group_by(User.id, User.name, User.department)
            .order_by(func.count(Shoutout.id).desc())
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
                func.count(ShoutoutRecipient.id).label("score"),
            )
            .join(ShoutoutRecipient, ShoutoutRecipient.recipient_id == User.id)
            .join(Shoutout, Shoutout.id == ShoutoutRecipient.shoutout_id)
        )
        if start_date:
            query = query.filter(Shoutout.created_at >= start_date)
        rows = (
            query.group_by(User.id, User.name, User.department)
            .order_by(func.count(ShoutoutRecipient.id).desc())
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
            .join(Shoutout, Shoutout.id == Reaction.shoutout_id)
        )
        if start_date:
            query = query.filter(Shoutout.created_at >= start_date)
        rows = (
            query.group_by(User.id, User.name, User.department)
            .order_by(func.count(Reaction.id).desc())
            .limit(limit).all()
        )
        return [{"id": r.id, "name": r.name, "department": r.department, "score": r.score} for r in rows]