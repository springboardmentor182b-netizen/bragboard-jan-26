from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.database.connection import get_db
from src.shoutouts import service, models
from src.auth.dependencies import get_current_user  # ← ADD THIS
from src.entities.user import User, UserRole  # ← ADD THIS

router = APIRouter()


# ENDPOINT 1: Create Shoutout
@router.post("/", response_model=models.ShoutoutResponse)
def create_shoutout(
    post: models.ShoutoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Create a new shoutout. User can only create as themselves."""
    # Verify sender_id matches authenticated user
    if post.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create shoutout for another user"
        )
    return service.create_shoutout(db, post)


# ENDPOINT 2: Get All Shoutouts
@router.get("/", response_model=List[models.ShoutoutResponse])
def read_shoutouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get all shoutouts (requires authentication)."""
    return service.get_all_shoutouts(db)


# ENDPOINT 3: Get My Shoutouts
@router.get("/my/{user_id}", response_model=List[models.ShoutoutResponse])
def read_my_shoutouts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get shoutouts for a specific user."""
    # Non-admins can only view their own shoutouts
    if current_user.role != UserRole.admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own shoutouts"
        )
    return service.get_my_shoutouts(db, user_id)


# ENDPOINT 4: Get Leaderboard
@router.get("/leaderboard", response_model=List[models.LeaderboardEntry])
def read_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get leaderboard (requires authentication)."""
    return service.get_leaderboard(db)


# ENDPOINT 5: Get Departments
@router.get("/departments", response_model=List[models.DepartmentStat])
def read_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Get department stats (requires authentication)."""
    return service.get_department_stats(db)


# ENDPOINT 6: Like Shoutout
@router.put("/{id}/like", response_model=models.ShoutoutResponse)
def like_shoutout(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← ADD THIS PARAMETER
):
    """Like a shoutout (requires authentication)."""
    return service.like_shoutout(db, id, current_user.id)  # ← ALSO PASS user_id