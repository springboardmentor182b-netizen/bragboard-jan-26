"""
Entities Controller
API endpoints for shout-outs, comments, reactions, and reports
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from src.database.connection import get_db
from .service import ShoutOutService, CommentService, ReactionService, ReportService
from .reaction import ReactionType


router = APIRouter()

# Pydantic models for request/response
class ShoutOutCreate(BaseModel):
    """Schema for creating a shout-out"""
    message: str
    recipient_ids: List[int]

class ShoutOutResponse(BaseModel):
    """Schema for shout-out response"""
    id: int
    sender_id: int
    message: str
    created_at: str = None
    recipients: List[dict] = []
    comments: List[dict] = []
    reactions: dict = {}
    
    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    """Schema for creating a comment"""
    shoutout_id: int
    content: str

class CommentResponse(BaseModel):
    """Schema for comment response"""
    id: int
    shoutout_id: int
    user_id: int
    content: str
    created_at: str = None
    
    class Config:
        from_attributes = True

class ReactionCreate(BaseModel):
    """Schema for adding a reaction"""
    shoutout_id: int
    type: ReactionType

class ReportCreate(BaseModel):
    """Schema for creating a report"""
    shoutout_id: int
    reason: str

class DashboardStats(BaseModel):
    """Schema for dashboard statistics"""
    total_shoutouts: int
    active_users: int
    engagement_rate: float
    top_contributors: List[dict]
    most_tagged: List[dict]

# Shout-out Endpoints
@router.post("/", response_model=ShoutOutResponse, status_code=status.HTTP_201_CREATED)
async def create_shoutout(
    shoutout_data: ShoutOutCreate,
    sender_id: int = 1,  # TODO: Get from JWT token
    db: Session = Depends(get_db)
):
    """Create a new shout-out"""
    shoutout = ShoutOutService.create_shoutout(
        db=db,
        sender_id=sender_id,
        message=shoutout_data.message,
        recipient_ids=shoutout_data.recipient_ids
    )
    
    # Build response
    response = shoutout.to_dict()
    response['recipients'] = [r.recipient.to_dict() for r in shoutout.recipients]
    response['comments'] = []
    response['reactions'] = {}
    
    return response

@router.get("/", response_model=List[ShoutOutResponse])
async def get_all_shoutouts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all shout-outs"""
    shoutouts = ShoutOutService.get_all_shoutouts(db, skip, limit)
    
    results = []
    for shoutout in shoutouts:
        data = shoutout.to_dict()
        data['recipients'] = [r.recipient.to_dict() for r in shoutout.recipients]
        data['comments'] = [c.to_dict() for c in shoutout.comments]
        data['reactions'] = ReactionService.get_reaction_counts(db, shoutout.id)
        results.append(data)
    
    return results

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get statistics for admin dashboard"""
    from src.users.service import UserService
    
    total_shoutouts = ShoutOutService.get_shoutout_count(db)
    active_users = UserService.get_user_count(db)
    top_contributors = ShoutOutService.get_top_contributors(db, limit=5)
    most_tagged = ShoutOutService.get_most_tagged_users(db, limit=5)
    
    # Calculate engagement rate (simplified)
    engagement_rate = (total_shoutouts / max(active_users, 1)) * 100 if active_users > 0 else 0
    
    return {
        "total_shoutouts": total_shoutouts,
        "active_users": active_users,
        "engagement_rate": round(engagement_rate, 2),
        "top_contributors": top_contributors,
        "most_tagged": most_tagged
    }

@router.get("/{shoutout_id}", response_model=ShoutOutResponse)
async def get_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    """Get a specific shout-out"""
    shoutout = ShoutOutService.get_shoutout_by_id(db, shoutout_id)
    if not shoutout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shout-out not found"
        )
    
    data = shoutout.to_dict()
    data['recipients'] = [r.recipient.to_dict() for r in shoutout.recipients]
    data['comments'] = [c.to_dict() for c in shoutout.comments]
    data['reactions'] = ReactionService.get_reaction_counts(db, shoutout.id)
    
    return data

@router.delete("/{shoutout_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    """Delete a shout-out"""
    success = ShoutOutService.delete_shoutout(db, shoutout_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shout-out not found"
        )
    return None

# Comment Endpoints
@router.post("/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_data: CommentCreate,
    user_id: int = 1,  # TODO: Get from JWT token
    db: Session = Depends(get_db)
):
    """Create a new comment"""
    comment = CommentService.create_comment(
        db=db,
        shoutout_id=comment_data.shoutout_id,
        user_id=user_id,
        content=comment_data.content
    )
    return comment.to_dict()

@router.get("/{shoutout_id}/comments", response_model=List[CommentResponse])
async def get_comments(shoutout_id: int, db: Session = Depends(get_db)):
    """Get all comments for a shout-out"""
    comments = CommentService.get_comments_by_shoutout(db, shoutout_id)
    return [c.to_dict() for c in comments]

@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    """Delete a comment"""
    success = CommentService.delete_comment(db, comment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    return None

# Reaction Endpoints
@router.post("/reactions", status_code=status.HTTP_201_CREATED)
async def add_reaction(
    reaction_data: ReactionCreate,
    user_id: int = 1,  # TODO: Get from JWT token
    db: Session = Depends(get_db)
):
    """Add a reaction to a shout-out"""
    reaction = ReactionService.add_reaction(
        db=db,
        shoutout_id=reaction_data.shoutout_id,
        user_id=user_id,
        reaction_type=reaction_data.type
    )
    return reaction.to_dict()

@router.delete("/reactions/{shoutout_id}/{reaction_type}")
async def remove_reaction(
    shoutout_id: int,
    reaction_type: ReactionType,
    user_id: int = 1,  # TODO: Get from JWT token
    db: Session = Depends(get_db)
):
    """Remove a reaction"""
    success = ReactionService.remove_reaction(db, shoutout_id, user_id, reaction_type)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reaction not found"
        )
    return {"message": "Reaction removed"}

@router.get("/{shoutout_id}/reactions")
async def get_reactions(shoutout_id: int, db: Session = Depends(get_db)):
    """Get reaction counts for a shout-out"""
    return ReactionService.get_reaction_counts(db, shoutout_id)

# Report Endpoints
@router.post("/reports", status_code=status.HTTP_201_CREATED)
async def create_report(
    report_data: ReportCreate,
    user_id: int = 1,  # TODO: Get from JWT token
    db: Session = Depends(get_db)
):
    """Report a shout-out for moderation"""
    report = ReportService.create_report(
        db=db,
        shoutout_id=report_data.shoutout_id,
        reported_by=user_id,
        reason=report_data.reason
    )
    return report.to_dict()

@router.get("/reports")
async def get_all_reports(db: Session = Depends(get_db)):
    """Get all reports for admin moderation"""
    reports = ReportService.get_all_reports(db)
    return [r.to_dict() for r in reports]

@router.delete("/reports/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(report_id: int, db: Session = Depends(get_db)):
    """Delete a report after resolution"""
    success = ReportService.delete_report(db, report_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return None
