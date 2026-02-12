from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database.core import get_db
from src.shoutouts import service, models

router = APIRouter()

@router.post("/", response_model=models.ShoutoutResponse)
def create_shoutout(post: models.ShoutoutCreate, db: Session = Depends(get_db)):
    return service.create_shoutout(db, post)

@router.get("/", response_model=List[models.ShoutoutResponse])
def read_shoutouts(db: Session = Depends(get_db)):
    return service.get_all_shoutouts(db)

# --- NEW ROUTES ---

@router.get("/my/{user_id}", response_model=List[models.ShoutoutResponse])
def read_my_shoutouts(user_id: int, db: Session = Depends(get_db)):
    return service.get_my_shoutouts(db, user_id)

@router.get("/leaderboard", response_model=List[models.LeaderboardEntry])
def read_leaderboard(db: Session = Depends(get_db)):
    return service.get_leaderboard(db)

@router.get("/departments", response_model=List[models.DepartmentStat])
def read_departments(db: Session = Depends(get_db)):
    return service.get_department_stats(db)

@router.put("/{id}/like", response_model=models.ShoutoutResponse)
def like_shoutout(id: int, db: Session = Depends(get_db)):
    return service.like_shoutout(db, id)