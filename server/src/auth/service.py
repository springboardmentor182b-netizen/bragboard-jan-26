from sqlalchemy.orm import Session
from src.entities.user import User
from src.auth.models import RegisterRequest

def register_user(db: Session, request: RegisterRequest):
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.username == request.username) | (User.email == request.email)
    ).first()
    
    if existing_user:
        return None
    
    # Create new user
    from src.users.service import UserService
    hashed_password = UserService.get_password_hash(request.password)
    db_user = User(
        username=request.username,
        email=request.email,
        hashed_password=hashed_password,
        role="user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_user(db: Session, username: str, password: str):
    from src.users.service import UserService
    user = db.query(User).filter(User.username == username).first()
    if not user or not UserService.verify_password(password, user.hashed_password):
        return None
    
    # Mock token for testing
    return {
        "access_token": f"mock_token_{user.id}",
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }
