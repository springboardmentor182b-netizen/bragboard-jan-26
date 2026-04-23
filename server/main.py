import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import all entity models so they are registered with Base
import src.entities  # noqa: F401

from src.database.connection import engine
from src.database.core import create_tables
from src.database.config import settings

from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.shoutouts.controller import router as shoutouts_router
from src.comments.controller import router as comments_router
from src.reactions.controller import router as reactions_router
from src.reports.controller import router as reports_router
from src.admin.controller import router as admin_router
from src.leaderboard.controller import router as leaderboard_router
from src.notifications.controller import router as notifications_router
from src.ai.controller import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create all database tables."""
    create_tables(engine)
    yield


app = FastAPI(
    title="BragBoard API",
    description="Peer-recognition shoutout platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(shoutouts_router)
app.include_router(comments_router)
app.include_router(reactions_router)
app.include_router(reports_router)
app.include_router(admin_router)
app.include_router(leaderboard_router)
app.include_router(notifications_router)
app.include_router(ai_router)

# ── Serve uploaded images ──────────────────────────────────────────────────────
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to BragBoard API",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
