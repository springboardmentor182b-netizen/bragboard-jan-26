from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.database.config import settings
from src.entities.user import User, UserStatus

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if password matches the hash."""
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """Hash a password for storage."""
    return pwd_context.hash(password)


def get_password_hash(password: str) -> str:
    """Alias for hash_password (for compatibility)."""
    return hash_password(password)

def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT access token.

    Returns:
        dict: The token payload (e.g. {"user_id": 1, "email": "...", "role": "..."})

    Raises:
        HTTPException 401: If the token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


def authenticate_user(db: Session, email: str, password: str) -> User:
    """
    Verify credentials and check approval status.

    Returns the user if credentials are valid AND user is approved.
    Raises HTTPException for pending/rejected/suspended users.
    Returns None for invalid credentials.
    """
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        return None

    if user.status == UserStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your account is pending admin approval. "
                "Please wait for an administrator to approve your registration."
            ),
        )

    if user.status == UserStatus.rejected:
        detail = "Your account registration was rejected."
        if user.rejection_reason:
            detail += f" Reason: {user.rejection_reason}"
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

    if user.status == UserStatus.suspended:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended. Please contact your administrator.",
        )

    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    # ─── FIX 2: datetime.utcnow() is deprecated in Python 3.12 ───────────────
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def register_new_user(db: Session, user_data) -> User:
    """
    Create a new user with hashed password and pending status.
    """
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_answer = None
    if hasattr(user_data, "security_answer") and user_data.security_answer:
        hashed_answer = hash_password(user_data.security_answer)

    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
        department=user_data.department,
        role=user_data.role if hasattr(user_data, "role") else None,
        status=UserStatus.pending,
        security_question=getattr(user_data, "security_question", None),
        security_answer=hashed_answer,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user