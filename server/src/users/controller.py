
from fastapi import APIRouter

from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.users.models import User
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/test")
def test_users():
    return {"message": "Users module working"}

@router.post("/create-test")
def create_test_user(db: Session = Depends(get_db)):

    user = User(
        email="alex@test.com",
        password="123",
        name="Alex"
    )

    db.add(user)
    db.commit()

    return {"message": "user created"}

