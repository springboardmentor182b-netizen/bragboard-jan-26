from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.orm import Session
from src.users.models import User, RoleEnum
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
import warnings
warnings.filterwarnings("ignore")
import bcrypt as _bcrypt

SECRET_KEY = os.getenv("SECRET_KEY", "admin2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET", "admin123")

def hash_password(password: str):
    return _bcrypt.hashpw(password[:72].encode('utf-8'), _bcrypt.gensalt()).decode('utf-8')

def verify_password(plain, hashed):
    return _bcrypt.checkpw(plain[:72].encode('utf-8'), hashed.encode('utf-8'))

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
    print("=== REGISTER ATTEMPT ===")
    print("Email:", data.email)
    print("Role:", data.role)
    print("Admin code received:", data.admin_code)
    print("Expected admin secret:", ADMIN_SECRET_CODE)

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise Exception("Email already registered")

    role = RoleEnum.employee
    if data.role == "admin":
        if not data.admin_code or data.admin_code != ADMIN_SECRET_CODE:
            raise Exception(f"Invalid admin code. Got: '{data.admin_code}' Expected: '{ADMIN_SECRET_CODE}'")
        role = RoleEnum.admin

    try:
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
        print("=== REGISTER SUCCESS ===")
        return {"message": "User registered successfully"}
    except Exception as e:
        db.rollback()
        print("=== DB ERROR ===", str(e))
        raise Exception(f"Database error: {str(e)}")

def login_user(db: Session, data):
    print("=== LOGIN ATTEMPT ===")
    print("Email:", data.email)
    print("Role:", data.role)

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        print("=== USER NOT FOUND ===")
        raise Exception("Invalid email or password")

    if not verify_password(data.password, user.password):
        print("=== PASSWORD MISMATCH ===")
        raise Exception("Invalid email or password")

    if user.role.value != data.role:
        print("=== ROLE MISMATCH ===", user.role.value, "!=", data.role)
        raise Exception(f"Access denied. This account is not registered as '{data.role}'.")

    token = create_access_token({"sub": user.email, "role": user.role.value})
    print("=== LOGIN SUCCESS ===")
    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.value,
        "user_id": user.id,       # ✅ added
        "name": user.name,         # ✅ added
        "email": user.email,       # ✅ added
        "department": user.department,  # ✅ added
    }