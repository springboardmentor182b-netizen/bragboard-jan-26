from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os, uuid, shutil
from src.database.connection import get_db
from src.shoutouts import service, models
from src.auth.dependencies import get_current_user
from src.entities.user import User, UserRole

router = APIRouter()

# ── Upload directory (served statically) ─────────────────────────────────────
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_SIZE_MB = 5


# ENDPOINT 1: Create Shoutout
@router.post("/", response_model=models.ShoutoutResponse)
def create_shoutout(
    post: models.ShoutoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new shoutout. User can only create as themselves."""
    if post.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create shoutout for another user"
        )
    return service.create_shoutout(db, post)


# ENDPOINT 1b: Create Shoutout with image (multipart)
@router.post("/with-image", response_model=models.ShoutoutResponse)
async def create_shoutout_with_image(
    sender_id: int = Form(...),
    message: str = Form(...),
    recipient_ids: str = Form(...),   # JSON array string: "[1,2,3]"
    tags: str = Form("[]"),           # JSON array string
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a shoutout with an optional image attachment."""
    import json
    if sender_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot create shoutout for another user")

    image_url = None
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Only JPG, PNG, GIF, and WebP images are allowed.")
        content = await image.read()
        if len(content) > MAX_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=400, detail=f"Image must be under {MAX_SIZE_MB}MB.")
        ext = image.filename.rsplit(".", 1)[-1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(content)
        image_url = f"/uploads/{filename}"

    try:
        r_ids = json.loads(recipient_ids)
        t_list = json.loads(tags)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid recipient_ids or tags format.")

    post_data = models.ShoutoutCreate(
        sender_id=sender_id,
        message=message,
        recipient_ids=r_ids,
        tags=t_list,
    )
    return service.create_shoutout(db, post_data, image_url=image_url)


# ENDPOINT 2: Get All Shoutouts
@router.get("/", response_model=List[models.ShoutoutResponse])
def read_shoutouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all shoutouts (requires authentication)."""
    return service.get_all_shoutouts(db)


# ENDPOINT 3: Get My Shoutouts
@router.get("/my/{user_id}", response_model=List[models.ShoutoutResponse])
def read_my_shoutouts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get shoutouts for a specific user."""
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
    current_user: User = Depends(get_current_user)
):
    """Get leaderboard (requires authentication)."""
    return service.get_leaderboard(db)


# ENDPOINT 5: Get Departments
@router.get("/departments", response_model=List[models.DepartmentStat])
def read_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get department stats (requires authentication)."""
    return service.get_department_stats(db)


# ENDPOINT 6: Like Shoutout
@router.put("/{id}/like", response_model=models.ShoutoutResponse)
def like_shoutout(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Like a shoutout (requires authentication)."""
    return service.like_shoutout(db, id, current_user.id)