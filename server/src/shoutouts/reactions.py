from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.config import get_db
from src.entities.shoutout import Reaction, ReactionType
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ReactionCreate(BaseModel):
    shoutout_id: int
    user_id: int
    type: str

class ReactionResponse(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    type: str

    class Config:
        from_attributes = True

@router.post("/reactions", response_model=ReactionResponse)
def create_reaction(reaction: ReactionCreate, db: Session = Depends(get_db)):
    db_reaction = Reaction(**reaction.dict())
    db.add(db_reaction)
    db.commit()
    db.refresh(db_reaction)
    return db_reaction

@router.get("/shoutouts/{shoutout_id}/reactions", response_model=List[ReactionResponse])
def get_reactions(shoutout_id: int, db: Session = Depends(get_db)):
    reactions = db.query(Reaction).filter(Reaction.shoutout_id == shoutout_id).all()
    return reactions

@router.delete("/reactions/{reaction_id}")
def delete_reaction(reaction_id: int, db: Session = Depends(get_db)):
    reaction = db.query(Reaction).filter(Reaction.id == reaction_id).first()
    if not reaction:
        raise HTTPException(status_code=404, detail="Reaction not found")
    db.delete(reaction)
    db.commit()
    return {"message": "Reaction removed successfully"}
