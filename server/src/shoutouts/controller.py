"""
Shoutout API Controller
RESTful endpoints for shoutout management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.database.connection import get_db
from src.shoutouts.models import ShoutoutCreate, ShoutoutUpdate, ShoutoutOut, ShoutoutFilter
from src.shoutouts import service


router = APIRouter(prefix="/admin/shoutouts", tags=["Admin - Shoutouts"])


@router.post("/", response_model=ShoutoutOut, status_code=status.HTTP_201_CREATED)
async def create_shoutout(
    data: ShoutoutCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new shoutout
    
    - **content**: The shoutout message (required, max 5000 chars)
    - **recipient_name**: Person being recognized (optional)
    - **visibility**: public, team, or private (default: public)
    """
    # TODO: Get author_id from authenticated user session
    # For now, using a placeholder author_id
    author_id = 1  # This should come from JWT token in production
    
    shoutout = service.create_shoutout(db, data, author_id)
    return shoutout


@router.get("/", response_model=List[ShoutoutOut])
async def get_all_shoutouts(
    author_id: int = None,
    visibility: str = None,
    include_deleted: bool = False,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get all shoutouts with optional filtering and pagination
    
    - **author_id**: Filter by author
    - **visibility**: Filter by visibility level
    - **include_deleted**: Include soft-deleted shoutouts
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum records to return (default 50, max 100)
    """
    filters = ShoutoutFilter(
        author_id=author_id,
        visibility=visibility,
        include_deleted=include_deleted,
        skip=skip,
        limit=limit
    )
    
    shoutouts = service.get_all_shoutouts(db, filters)
    return shoutouts


@router.get("/{shoutout_id}", response_model=ShoutoutOut)
async def get_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific shoutout by ID
    
    - **shoutout_id**: ID of the shoutout
    """
    shoutout = service.get_shoutout_by_id(db, shoutout_id)
    
    if not shoutout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shoutout with ID {shoutout_id} not found"
        )
    
    return shoutout


@router.put("/{shoutout_id}", response_model=ShoutoutOut)
async def update_shoutout(
    shoutout_id: int,
    data: ShoutoutUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing shoutout
    
    - **shoutout_id**: ID of the shoutout to update
    - **content**: New content (optional)
    - **recipient_name**: New recipient name (optional)
    - **visibility**: New visibility level (optional)
    """
    shoutout = service.update_shoutout(db, shoutout_id, data)
    return shoutout


@router.delete("/{shoutout_id}", response_model=ShoutoutOut)
async def delete_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a shoutout (soft delete)
    
    - **shoutout_id**: ID of the shoutout to delete
    """
    shoutout = service.delete_shoutout(db, shoutout_id)
    return shoutout


@router.get("/user/{user_id}", response_model=List[ShoutoutOut])
async def get_user_shoutouts(
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get all shoutouts created by a specific user
    
    - **user_id**: ID of the user
    - **skip**: Number of records to skip
    - **limit**: Maximum records to return
    """
    shoutouts = service.get_user_shoutouts(db, user_id, skip, limit)
    return shoutouts
