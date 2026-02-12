"""
Pydantic Models for Shoutout API
Request and response schemas
"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum


class VisibilityEnum(str, Enum):
    """Visibility levels for shoutouts"""
    PUBLIC = "public"
    TEAM = "team"
    PRIVATE = "private"


class ShoutoutCreate(BaseModel):
    """Schema for creating a new shoutout"""
    content: str = Field(..., min_length=1, max_length=5000, description="Shoutout content")
    recipient_name: Optional[str] = Field(None, max_length=255, description="Person being recognized")
    visibility: VisibilityEnum = Field(default=VisibilityEnum.PUBLIC, description="Visibility level")
    
    @field_validator('content')
    @classmethod
    def content_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Content cannot be empty or whitespace only')
        return v.strip()


class ShoutoutUpdate(BaseModel):
    """Schema for updating an existing shoutout"""
    content: Optional[str] = Field(None, min_length=1, max_length=5000)
    recipient_name: Optional[str] = Field(None, max_length=255)
    visibility: Optional[VisibilityEnum] = None
    
    @field_validator('content')
    @classmethod
    def content_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and (not v or not v.strip()):
            raise ValueError('Content cannot be empty or whitespace only')
        return v.strip() if v else None


class ShoutoutOut(BaseModel):
    """Schema for returning shoutout data"""
    id: int
    content: str
    author_id: int
    recipient_name: Optional[str]
    visibility: str
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    
    class Config:
        from_attributes = True


class ShoutoutFilter(BaseModel):
    """Schema for filtering shoutouts"""
    author_id: Optional[int] = None
    visibility: Optional[VisibilityEnum] = None
    include_deleted: bool = False
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=50, ge=1, le=100)
