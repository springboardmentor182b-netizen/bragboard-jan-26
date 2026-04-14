from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ✅ Import Base + engine from connection.py (feature branch pattern)
from src.database.connection import Base, engine
from src.database.config import settings

# ─── Import ALL entity models BEFORE create_all() ────────────────────────────
# SQLAlchemy must see every model class before Base.metadata.create_all()
# so it knows which tables to create.
from src.entities.user import User                              # noqa: F401
from src.entities.shoutout import Shoutout, ShoutoutRecipient  # noqa: F401
from src.entities.shoutout_like import ShoutoutLike             # noqa: F401
from src.entities.comment import Comment                        # noqa: F401
from src.entities.reaction import Reaction                      # noqa: F401
from src.entities.report import Report                          # noqa: F401

# AdminLog is safe now (back_populates removed in fixed admin_log.py)
try:
    from src.entities.admin_log import AdminLog                 # noqa: F401
except Exception as e:
    print(f"⚠️  AdminLog import skipped: {e}")

# ─── Create tables ────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="BragBoard API",
    description="Internal Employee Recognition Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
from src.auth.controller import router as auth_router
from src.leaderboard.controller import router as leaderboard_router
from src.shoutouts.controller import router as shoutouts_router
from src.users.controller import router as users_router
from src.reports.controller import router as reports_router
from src.reactions.controller import router as reactions_router
from src.comments.controller import router as comments_router
from src.admin.controller import router as admin_router
from src.notifications.controller import router as notifications_router
from src.ai.controller import router as ai_router


app.include_router(auth_router)
app.include_router(leaderboard_router)
app.include_router(shoutouts_router, prefix="/shoutouts", tags=["Shoutouts"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(reports_router)
app.include_router(reactions_router)
app.include_router(comments_router)
app.include_router(admin_router) 
  # ← registers /admin/*
app.include_router(notifications_router)
app.include_router(ai_router)

# ── Serve uploaded images ──────────────────────────────────────────────────────
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ─── Health endpoints ─────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to BragBoard API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}

