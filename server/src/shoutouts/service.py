"""
Shoutout Service Layer
Business logic for shoutout operations
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from fastapi import HTTPException

from src.entities.shoutout import Shoutout, VisibilityEnum
from src.shoutouts.models import ShoutoutCreate, ShoutoutUpdate, ShoutoutFilter


def create_shoutout(db: Session, data: ShoutoutCreate, author_id: int) -> Shoutout:
    """
    Create a new shoutout
    
    Args:
        db: Database session
        data: Shoutout data
        author_id: ID of the user creating the shoutout
        
    Returns:
        Created shoutout object
    """
    shoutout = Shoutout(
        content=data.content,
        author_id=author_id,
        recipient_name=data.recipient_name,
        visibility=data.visibility
    )
    
    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)
    
    return shoutout


def get_all_shoutouts(db: Session, filters: ShoutoutFilter) -> List[Shoutout]:
    """
    Get all shoutouts with optional filtering and pagination
    
    Args:
        db: Database session
        filters: Filter criteria
        
    Returns:
        List of shoutouts
    """
    query = db.query(Shoutout)
    
    # Apply filters
    conditions = []
    
    if not filters.include_deleted:
        conditions.append(Shoutout.is_deleted == False)
    
    if filters.author_id:
        conditions.append(Shoutout.author_id == filters.author_id)
    
    if filters.visibility:
        conditions.append(Shoutout.visibility == filters.visibility)
    
    if conditions:
        query = query.filter(and_(*conditions))
    
    # Order by most recent first
    query = query.order_by(Shoutout.created_at.desc())
    
    # Apply pagination
    query = query.offset(filters.skip).limit(filters.limit)
    
    return query.all()


def get_shoutout_by_id(db: Session, shoutout_id: int, include_deleted: bool = False) -> Optional[Shoutout]:
    """
    Get a specific shoutout by ID
    
    Args:
        db: Database session
        shoutout_id: Shoutout ID
        include_deleted: Whether to include deleted shoutouts
        
    Returns:
        Shoutout object or None if not found
    """
    query = db.query(Shoutout).filter(Shoutout.id == shoutout_id)
    
    if not include_deleted:
        query = query.filter(Shoutout.is_deleted == False)
    
    return query.first()


def update_shoutout(db: Session, shoutout_id: int, data: ShoutoutUpdate) -> Shoutout:
    """
    Update an existing shoutout
    
    Args:
        db: Database session
        shoutout_id: Shoutout ID
        data: Update data
        
    Returns:
        Updated shoutout object
        
    Raises:
        HTTPException: If shoutout not found
    """
    shoutout = get_shoutout_by_id(db, shoutout_id)
    
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    
    # Update only provided fields
    if data.content is not None:
        shoutout.content = data.content
    
    if data.recipient_name is not None:
        shoutout.recipient_name = data.recipient_name
    
    if data.visibility is not None:
        shoutout.visibility = data.visibility
    
    db.commit()
    db.refresh(shoutout)
    
    return shoutout


def delete_shoutout(db: Session, shoutout_id: int) -> Shoutout:
    """
    Soft delete a shoutout
    
    Args:
        db: Database session
        shoutout_id: Shoutout ID
        
    Returns:
        Deleted shoutout object
        
    Raises:
        HTTPException: If shoutout not found
    """
    shoutout = get_shoutout_by_id(db, shoutout_id)
    
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    
    shoutout.is_deleted = True
    db.commit()
    db.refresh(shoutout)
    
    return shoutout


def get_user_shoutouts(db: Session, user_id: int, skip: int = 0, limit: int = 50) -> List[Shoutout]:
    """
    Get all shoutouts by a specific user
    
    Args:
        db: Database session
        user_id: User ID
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of shoutouts
    """
    return (
        db.query(Shoutout)
        .filter(Shoutout.author_id == user_id, Shoutout.is_deleted == False)
        .order_by(Shoutout.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
