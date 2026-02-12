from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from src.auth.models import Token

# Security Configurations
SECRET_KEY = "YOUR_SUPER_SECRET_KEY"  # In production, use an environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        # Ensure we are passing strings to verify
        return pwd_context.verify(str(plain_password), str(hashed_password))

    @staticmethod
    def get_password_hash(password: str) -> str:
        # Force the input to a string to avoid the 72-byte error
        return pwd_context.hash(str(password))
    @staticmethod
    def create_tokens(user_id: int, role: str) -> Token:
        # Access Token
        access_expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_data = {"sub": str(user_id), "role": role, "exp": access_expire}
        access_token = jwt.encode(access_data, SECRET_KEY, algorithm=ALGORITHM)

        # Refresh Token
        refresh_expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_data = {"sub": str(user_id), "exp": refresh_expire}
        refresh_token = jwt.encode(refresh_data, SECRET_KEY, algorithm=ALGORITHM)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
from fastapi import HTTPException, status, Depends

async def get_current_admin(token_data: dict = Depends(AuthService.create_tokens)):
    # This logic will be expanded once we set up the Controller
    if token_data.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access the Admin Dashboard"
        )
    return token_data