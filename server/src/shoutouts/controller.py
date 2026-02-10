from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.shoutouts import service, models

router = APIRouter()

@router.post("/", response_model=models.ShoutoutResponse)
def create_shoutout(post: models.ShoutoutCreate, db: Session = Depends(get_db)):
    return service.create_shoutout(db, post)

@router.get("/")
def read_shoutouts(db: Session = Depends(get_db)):
    return service.get_all_shoutouts(db)