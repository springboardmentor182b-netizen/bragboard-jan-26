from sqlalchemy.orm import Session
from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.shoutouts.models import ShoutoutCreate

def create_shoutout(db: Session, shoutout_data: ShoutoutCreate):
    # 1. Save the Shoutout
    tag_string = ",".join(shoutout_data.tags)
    new_shoutout = Shoutout(
        sender_id=shoutout_data.sender_id,
        message=shoutout_data.message,
        tags=tag_string
    )
    db.add(new_shoutout)
    db.commit()
    db.refresh(new_shoutout)

    # 2. Save Recipients
    for r_id in shoutout_data.recipient_ids:
        recipient = ShoutoutRecipient(shoutout_id=new_shoutout.id, recipient_id=r_id)
        db.add(recipient)
    
    db.commit()
    return new_shoutout

def get_all_shoutouts(db: Session):
    return db.query(Shoutout).order_by(Shoutout.created_at.desc()).all()