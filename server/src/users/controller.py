from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.entities.user import User
from src.users.models import DashboardStats
from src.users.service import get_dashboard_stats
from src.auth.service import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return get_dashboard_stats(current_user.id, db)
