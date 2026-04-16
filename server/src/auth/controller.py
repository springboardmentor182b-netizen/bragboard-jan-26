from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database.config import get_db
from src.auth.models import RegisterRequest, LoginRequest, TokenResponse
from src.auth.service import register_user, login_user
from src.auth.dependencies import get_current_user
from src.entities.user import User

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    result = register_user(db, request)
    if not result:
        raise HTTPException(status_code=400, detail="User already exists or registration failed")
    return {"message": "User registered successfully", "user_id": result.id}

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(db, request.username, request.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return result

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role
    }
