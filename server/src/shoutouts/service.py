import json
import os
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from src.entities.shoutout import Shoutout, ShoutoutRecipient
from src.entities.user import User
from src.shoutouts.models import ShoutoutCreate

def create_shoutout(db: Session, shoutout_data: ShoutoutCreate):
    tag_string = ",".join(shoutout_data.tags)
    new_shoutout = Shoutout(
        sender_id=shoutout_data.sender_id,
        message=shoutout_data.message,
        tags=tag_string
    )
    db.add(new_shoutout)
    db.commit()
    db.refresh(new_shoutout)

    for r_id in shoutout_data.recipient_ids:
        recipient = ShoutoutRecipient(shoutout_id=new_shoutout.id, recipient_id=r_id)
        db.add(recipient)
    
    db.commit()
    return new_shoutout

def get_all_shoutouts(db: Session):
    return db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.recipients).joinedload(ShoutoutRecipient.recipient)
    ).order_by(Shoutout.created_at.desc()).all()

def get_all_shoutouts(db: Session):
    return db.query(Shoutout).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.recipients).joinedload(ShoutoutRecipient.recipient)
    ).order_by(Shoutout.created_at.desc()).all()

# --- NEW FUNCTIONS ---

def get_my_shoutouts(db: Session, user_id: int):
    # Get shoutouts sent by ME or received by ME
    return db.query(Shoutout).join(ShoutoutRecipient).filter(
        (Shoutout.sender_id == user_id) | (ShoutoutRecipient.recipient_id == user_id)
    ).options(
        joinedload(Shoutout.sender),
        joinedload(Shoutout.recipients).joinedload(ShoutoutRecipient.recipient)
    ).distinct().all()

def get_leaderboard(db: Session):
    # Count how many shoutouts each user RECEIVED
    return db.query(
        User.id,
        User.name,
        User.department,
        func.count(ShoutoutRecipient.id).label('score')
    ).join(ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id)\
     .group_by(User.id)\
     .order_by(desc('score'))\
     .limit(10).all()

def get_department_stats(db: Session):
    # Count users and shoutouts per department
    results = []
    departments = db.query(User.department).distinct().all()
    
    for dept in departments:
        d_name = dept[0]
        if not d_name: continue
        
        # Count members
        m_count = db.query(User).filter(User.department == d_name).count()
        
        # Count total shoutouts received by this department
        s_count = db.query(ShoutoutRecipient).join(User).filter(User.department == d_name).count()
        
        results.append({"name": d_name, "member_count": m_count, "shoutout_count": s_count})
    
    return results

def like_shoutout(db: Session, shoutout_id: int):
    # 1. Find the shoutout
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if shoutout:
        # 2. Add 1 to likes
        shoutout.likes += 1
        db.commit()
        db.refresh(shoutout)
    return shoutout

def get_tags():
    # 1. Find the exact folder where this service.py file lives
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    # 2. Build the full path to the tags.json file
    file_path = os.path.join(current_directory, "tags.json")
    
    # 3. Open the file and load the data
    try:
        with open(file_path, "r") as file:
            tags = json.load(file)
            return tags
    except FileNotFoundError:
        # Fallback just in case the file is missing
        return ["Tags unavailable"]