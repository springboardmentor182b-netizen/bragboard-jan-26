from sqlalchemy.orm import Session
from src.entities.user import User
from src.auth.models import RegisterRequest, LoginRequest
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def register_user(db: Session, data: RegisterRequest):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise Exception("Email already registered")

    user = User(
        full_name=data.full_name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}


def login_user(db: Session, data: LoginRequest):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise Exception("Invalid email or password")

    return {"message": "Login successful"}
