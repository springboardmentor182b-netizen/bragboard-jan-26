from fastapi import APIRouter
from .models import SignupRequest, LoginRequest
from .service import signup_user, login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup")
def signup(data: SignupRequest):
    return signup_user(data)


@router.post("/login")
def login(data: LoginRequest):
    return login_user(data)