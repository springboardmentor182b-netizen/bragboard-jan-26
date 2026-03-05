from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.core.database import SessionLocal
from .schemas import UserCreate, UserLogin
from .service import register_user, authenticate_user, generate_tokens
from src.reports.controller import router as reports_router

app.include_router(reports_router)


router = APIRouter(prefix="/auth", tags=["Authentication"])


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        register_user(db, user)
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return generate_tokens(db_user)
