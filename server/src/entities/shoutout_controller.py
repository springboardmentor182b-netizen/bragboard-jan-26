from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.entities.models import Shoutout

router = APIRouter(
    prefix="/shoutouts",
    tags=["Shoutouts"]
)


@router.post("/")
def create_shoutout(db: Session = Depends(get_db), sender: str = "", receiver: str = "", message: str = ""):
    sender=sender.lower()
    receiver=receiver.lower()


    shoutout = Shoutout(
        sender=sender,
        receiver=receiver,
        message=message
    )

    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)

    return shoutout


@router.get("/")
def get_shoutouts(db: Session = Depends(get_db)):
    return db.query(Shoutout).all()