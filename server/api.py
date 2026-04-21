from fastapi import APIRouter
# UPDATE THIS LINE to point to your new router file
from app.api.v1.admin.router import router as admin_router
# Keep your other imports
from src.shoutouts.controller import router as shoutout_router 
from src.users.controller import router as users_router

api_router = APIRouter()

api_router.include_router(admin_router, prefix="/admin")
api_router.include_router(shoutout_router, prefix="/shoutouts")
api_router.include_router(users_router, prefix="/users")