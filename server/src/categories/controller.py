from fastapi import APIRouter
from src.categories.models import CategoryResponse
from typing import List

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=List[CategoryResponse])
def get_categories():
    """Get all available shoutout categories"""
    categories = [
        {"value": "teamwork", "label": "Teamwork"},
        {"value": "innovation", "label": "Innovation"},
        {"value": "leadership", "label": "Leadership"},
        {"value": "helpfulness", "label": "Helpfulness"},
        {"value": "excellence", "label": "Excellence"},
    ]
    return categories
