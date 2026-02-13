from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# 1. SIMPLE CONTEXT: Removed all extra keywords to stop the KeyError
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. Define the OAuth2 Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# 3. Security Configuration
SECRET_KEY = "YOUR_SUPER_SECRET_KEY" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        # THE FIX: Force the plain password to bytes using .encode('utf-8')
        # This matches how we hashed it during registration!
        return pwd_context.verify(plain_password[:72].encode('utf-8'), hashed_password)
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hashes password using manual truncation for compatibility."""
        # By cutting it to 72 here, passlib never sees the 'long' password
        safe_password = str(password)[:72]
        return pwd_context.hash(safe_password)

    @staticmethod
    def create_tokens(user_id: int, role: str):
        access_expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_data = {"sub": str(user_id), "role": role, "exp": access_expire}
        access_token = jwt.encode(access_data, SECRET_KEY, algorithm=ALGORITHM)

        refresh_expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_data = {"sub": str(user_id), "exp": refresh_expire}
        refresh_token = jwt.encode(refresh_data, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "role": role 
        }

    @staticmethod
    def verify_token(token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            role: str = payload.get("role")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            return {"user_id": user_id, "role": role}
        except JWTError:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

# --- ADMIN GUARD ---
async def get_current_admin(token_data: dict = Depends(AuthService.verify_token)):
    if token_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return token_data