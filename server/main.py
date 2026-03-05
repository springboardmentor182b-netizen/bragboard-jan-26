from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Import Base + engine from connection.py (feature branch pattern)
from src.database.connection import Base, engine

# ─── Import ALL entity models BEFORE create_all() ────────────────────────────
# SQLAlchemy must see every model class before Base.metadata.create_all()
# so it knows which tables to create.
from src.entities.user import User                              # noqa: F401
from src.entities.shoutout import Shoutout, ShoutoutRecipient  # noqa: F401
from src.entities.shoutout_like import ShoutoutLike             # noqa: F401
from src.entities.comment import Comment                        # noqa: F401
from src.entities.reaction import Reaction                      # noqa: F401

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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
from src.auth.controller import router as auth_router
from src.leaderboard.controller import router as leaderboard_router
from src.shoutouts.controller import router as shoutouts_router
from src.users.controller import router as users_router


from src.admin.controller import router as admin_router

app.include_router(auth_router)
app.include_router(leaderboard_router)
app.include_router(shoutouts_router, prefix="/shoutouts", tags=["Shoutouts"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(admin_router)   # ← registers /admin/*


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