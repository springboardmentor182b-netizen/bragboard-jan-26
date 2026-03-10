from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.users.models import User

router = APIRouter()

@router.get('/stats')
def get_admin_stats(db: Session = Depends(get_db)):
    user_count = db.query(User).count()
    return {
        'users': user_count,
        'shoutouts': 45,  # Placeholder until shoutouts table is ready
        'reports': 3      # Placeholder until reports table is ready
    }

