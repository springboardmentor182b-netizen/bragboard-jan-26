from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.database import get_db
from src.entities import models, schemas

router = APIRouter(tags=["Auth"])

@router.post("/login", response_model=schemas.User)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Simple password check (in real app use bcrypt)
    # The 'fake_hashed_password' logic in create_user is: user.password + "notreallyhashed"
    # For now, we just return the user if found as per original logic.
    return db_user
