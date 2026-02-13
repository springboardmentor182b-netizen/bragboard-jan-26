from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.core.database import SessionLocal
from .service import register_user, authenticate_user, generate_tokens
from pydantic import BaseModel, EmailStr


router = APIRouter(prefix="/auth", tags=["Authentication"])


# ======================
# Request Schemas
# ======================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ======================
# DB Dependency
# ======================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ======================
# REGISTER
# ======================

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        register_user(db, user)
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================
# LOGIN
# ======================

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return generate_tokens(db_user)
