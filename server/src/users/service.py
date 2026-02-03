from sqlalchemy.orm import Session
from src.entities.shoutout import ShoutOut, ShoutOutRecipient
from src.entities.reaction import ReactionType

def get_dashboard_stats(user_id: int, db: Session):
    received_count = db.query(ShoutOutRecipient).filter(
        ShoutOutRecipient.recipient_id == user_id
    ).count()
    
    sent_count = db.query(ShoutOut).filter(
        ShoutOut.sender_id == user_id
    ).count()
    
    recent_shoutouts = db.query(ShoutOut).order_by(
        ShoutOut.created_at.desc()
    ).limit(10).all()
    
    shoutout_responses = []
    for shoutout in recent_shoutouts:
        recipients = [recipient.recipient for recipient in shoutout.recipients]
        reaction_counts = {
            "like": sum(1 for r in shoutout.reactions if r.type == ReactionType.like),
            "clap": sum(1 for r in shoutout.reactions if r.type == ReactionType.clap),
            "star": sum(1 for r in shoutout.reactions if r.type == ReactionType.star),
        }
        shoutout_responses.append({
            "id": shoutout.id,
            "sender": shoutout.sender,
            "message": shoutout.message,
            "created_at": shoutout.created_at,
            "recipients": recipients,
            "reaction_counts": reaction_counts,
            "comment_count": len(shoutout.comments)
        })
    
    return {
        "total_shoutouts_received": received_count,
        "total_shoutouts_sent": sent_count,
        "recent_shoutouts": shoutout_responses
    }
