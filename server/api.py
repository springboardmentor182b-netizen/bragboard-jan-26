from fastapi import APIRouter
from src.admin.controller import router as admin_router
from src.shoutouts.controller import router as shoutout_router # If created

api_router = APIRouter()
api_router.include_router(admin_router)
api_router.include_router(shoutout_router)
# Include other routers here