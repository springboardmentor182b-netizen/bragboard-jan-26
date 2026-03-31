from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.orm import Session
from src.users.models import User, RoleEnum
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET", "admin123")


def hash_password(password: str):
    return pwd_context.hash(password[:72])


def verify_password(plain, hashed):
    return pwd_context.verify(plain[:72], hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


def register_user(db: Session, data):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise Exception("Email already registered")

    role = RoleEnum.employee
    if data.role == "admin":
        if not data.admin_code or data.admin_code != ADMIN_SECRET_CODE:
            raise Exception("Invalid admin code")
        role = RoleEnum.admin

    user = User(
        name=data.full_name,
        email=data.email,
        password=hash_password(data.password),
        department=data.department,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered successfully"}


def login_user(db: Session, data):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise Exception("Invalid email or password")

    # Role check — must match what frontend selected
    if user.role.value != data.role:
        raise Exception(f"Access denied. This account is not registered as '{data.role}'.")

    token = create_access_token({"sub": user.email, "role": user.role.value})
    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.value,
    }