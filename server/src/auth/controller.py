from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.database.core import SessionLocal
from src.auth.models import RegisterRequest, LoginRequest
from src.auth.service import register_user, login_user, verify_token, hash_password, create_access_token
from src.users.service import UserService
from src.users.models import RoleEnum, User
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import httpx
import os

router = APIRouter(tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

print(f"GOOGLE_CLIENT_ID loaded: {GOOGLE_CLIENT_ID}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user = UserService.get_user_by_email(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        return register_user(db, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        return login_user(db, data)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# ── Google OAuth ──────────────────────────────────────────────────────────────
class GoogleTokenRequest(BaseModel):
    token: str


@router.post("/google")
def google_login(data: GoogleTokenRequest, db: Session = Depends(get_db)):
    try:
        print(f"Received token: {data.token[:50]}...")
        idinfo = id_token.verify_oauth2_token(
            data.token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
        email = idinfo.get("email")
        name = idinfo.get("name", email)

        if not email:
            raise HTTPException(status_code=400, detail="Could not get email from Google")

        user = UserService.get_user_by_email(db, email)
        if not user:
            user = User(
                name=name,
                email=email,
                password=hash_password(os.urandom(32).hex()),
                department="General",
                role=RoleEnum.employee,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token({"sub": user.email, "role": user.role.value})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role.value,
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
            "department": user.department,
        }
    except ValueError as e:
        print(f"ValueError: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {type(e).__name__}: {e}")
        raise HTTPException(status_code=401, detail=f"Error: {str(e)}")


# ── GitHub OAuth ──────────────────────────────────────────────────────────────
class GitHubCodeRequest(BaseModel):
    code: str


@router.post("/github")
async def github_login(data: GitHubCodeRequest, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": data.code,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_res.json()
        github_token = token_data.get("access_token")

        if not github_token:
            raise HTTPException(status_code=401, detail="GitHub authentication failed")

        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {github_token}"},
        )
        github_user = user_res.json()

        email = github_user.get("email")
        if not email:
            email_res = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {github_token}"},
            )
            emails = email_res.json()
            primary = next((e for e in emails if e.get("primary")), None)
            email = primary["email"] if primary else None

        if not email:
            raise HTTPException(status_code=400, detail="Could not get email from GitHub")

        name = github_user.get("name") or github_user.get("login", email)

        user = UserService.get_user_by_email(db, email)
        if not user:
            user = User(
                name=name,
                email=email,
                password=hash_password(os.urandom(32).hex()),
                department="General",
                role=RoleEnum.employee,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token({"sub": user.email, "role": user.role.value})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role.value,
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
            "department": user.department,
        }