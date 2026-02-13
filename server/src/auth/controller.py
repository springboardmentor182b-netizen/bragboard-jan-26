from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.entities.user import User
from src.auth.models import UserCreate, UserLogin, Token
from src.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and save user
    hashed_pwd = AuthService.get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pwd,
        department=user_data.department,
        role=user_data.role # This handles the role assignment
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not AuthService.verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # We pass the role into the token so the frontend can read it
    return AuthService.create_tokens(user_id=user.id, role=user.role.value)

# --- NEW ADMIN LOGIC BELOW ---

@router.get("/admin/verify")
def verify_admin(token_data = Depends(AuthService.verify_token), db: Session = Depends(get_db)):
    """
    This endpoint checks if the logged-in user is an Admin.
    Your projectmate can call this when the Admin Dashboard loads.
    """
    user = db.query(User).filter(User.id == token_data.get("user_id")).first()
    
    if not user or user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have admin privileges"
        )
    
    return {"status": "success", "message": "Welcome, Admin", "user": user.name}