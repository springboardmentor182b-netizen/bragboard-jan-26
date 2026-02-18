from fastapi import APIRouter

from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.shoutouts.controller import router as shoutouts_router
from src.comments.controller import router as comments_router
from src.reactions.controller import router as reactions_router
from src.reports.controller import router as reports_router
from src.admin.controller import router as admin_router
from src.leaderboard.controller import router as leaderboard_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(shoutouts_router)
api_router.include_router(comments_router)
api_router.include_router(reactions_router)
api_router.include_router(reports_router)
api_router.include_router(admin_router)
api_router.include_router(leaderboard_router)

