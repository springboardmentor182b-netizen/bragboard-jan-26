from fastapi import APIRouter
# UPDATE THIS LINE to point to your new router file
from app.api.v1.admin.router import router as admin_router
# Keep your other imports
from src.shoutouts.controller import router as shoutout_router 

api_router = APIRouter()

# This connects the /admin prefix to the "John Doe" code
api_router.include_router(admin_router, prefix="/admin")
api_router.include_router(shoutout_router)