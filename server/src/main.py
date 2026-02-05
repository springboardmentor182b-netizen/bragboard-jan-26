from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import List, Optional

from . import database
from . import models

# Create Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic Models (Data Validation) ---
class ShoutoutCreate(BaseModel):
    sender_id: int
    message: str
    recipient_ids: List[int] # List of user IDs being recognized
    tags: List[str]          # List of tags like ["Teamwork"]

class UserResponse(BaseModel):
    id: int
    name: str

# --- API Endpoints ---

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/shoutouts")
def get_shoutouts(db: Session = Depends(get_db)):
    # Fetch shoutouts with sender and recipients data
    return db.query(models.Shoutout).options(
        joinedload(models.Shoutout.sender),
        joinedload(models.Shoutout.recipients).joinedload(models.ShoutoutRecipient.recipient)
    ).order_by(models.Shoutout.created_at.desc()).all()

@app.post("/shoutouts")
def create_shoutout(post: ShoutoutCreate, db: Session = Depends(get_db)):
    # 1. Create the Shoutout
    tag_string = ",".join(post.tags) # Convert list to string for DB
    new_shoutout = models.Shoutout(
        sender_id=post.sender_id,
        message=post.message,
        tags=tag_string
    )
    db.add(new_shoutout)
    db.commit()
    db.refresh(new_shoutout)

    # 2. Add Recipients
    for r_id in post.recipient_ids:
        recipient = models.ShoutoutRecipient(shoutout_id=new_shoutout.id, recipient_id=r_id)
        db.add(recipient)
    
    db.commit()
    return {"message": "Shoutout posted successfully!"}