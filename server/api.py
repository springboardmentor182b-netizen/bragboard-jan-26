# Central API registration point
# All routers are registered here and imported in main.py
from fastapi import APIRouter
from src.users import controller as dashboard_controller

api_router = APIRouter()
api_router.include_router(dashboard_controller.router, prefix="/dashboard", tags=["Employee Dashboard"])
