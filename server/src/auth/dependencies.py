from fastapi import Depends, HTTPException
from unittest.mock import Mock
from src.entities.user import User

# Create a mock user for testing
MOCK_USER = Mock(spec=User)
MOCK_USER.id = 1
MOCK_USER.role = "admin"
MOCK_USER.email = "test@example.com"
MOCK_USER.username = "testuser"
MOCK_USER.is_active = True

async def get_current_user():
    """Mock authentication - always returns a test admin user"""
    return MOCK_USER

async def get_current_active_user(current_user = Depends(get_current_user)):
    return current_user
