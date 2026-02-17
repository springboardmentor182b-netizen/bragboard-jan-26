from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from ..entities.user import User

# TODO: Uncomment when ShoutOut module is created (Module B)
# from ..entities.shoutout import ShoutOut, ShoutOutRecipient
# from ..entities.reaction import Reaction


def get_top_contributors(db: Session, limit: int = 10):
    """
    Get users who sent the most shout-outs
    """
    # TODO: Uncomment when ShoutOut table exists
    # results = (
    #     db.query(
    #         User.id,
    #         User.name,
    #         User.department,
    #         func.count(ShoutOut.id).label('count')
    #     )
    #     .join(ShoutOut, User.id == ShoutOut.sender_id)
    #     .group_by(User.id, User.name, User.department)
    #     .order_by(desc('count'))
    #     .limit(limit)
    #     .all()
    # )
    
    # Temporary empty response until ShoutOut module is built
    return {
        "title": "Top Contributors",
        "description": "Employees who sent the most shout-outs",
        "leaderboard": []
    }


def get_most_appreciated(db: Session, limit: int = 10):
    """
    Get users who received the most shout-outs
    """
    # TODO: Uncomment when ShoutOutRecipient table exists
    return {
        "title": "Most Appreciated",
        "description": "Employees who received the most recognition",
        "leaderboard": []
    }


def get_top_reactors(db: Session, limit: int = 10):
    """
    Get users who gave the most reactions
    """
    # TODO: Uncomment when Reaction table exists
    return {
        "title": "Top Reactors",
        "description": "Most engaged employees by reactions given",
        "leaderboard": []
    }


def get_department_stats(db: Session):
    """
    Get engagement statistics by department
    """
    # TODO: Uncomment when ShoutOut tables exist
    return {
        "title": "Department Engagement",
        "description": "Shout-out activity by department",
        "departments": []
    }
