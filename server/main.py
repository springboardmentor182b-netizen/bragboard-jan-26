<<<<<<< HEAD
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all entity models so they are registered with Base
import src.entities  # noqa: F401

from src.database.connection import engine
from src.database.core import create_tables
from api import api_router


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
    allow_origins=["*"],
=======
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import Base, engine
from src.auth.controller import router as auth_router
from src.leaderboard.controller import router as leaderboard_router
from src.shoutouts.controller import router as shoutouts_router
from src.users.controller import router as users_router  # ← ADDED

# Import all entities so SQLAlchemy registers them before create_all
from src.entities import user, shoutout  # noqa: F401

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BragBoard API",
    description="Internal Employee Recognition Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
>>>>>>> origin/main-group-D
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# Mount all routes
app.include_router(api_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
=======
# Register all routers
app.include_router(auth_router)
app.include_router(leaderboard_router)
app.include_router(shoutouts_router, prefix="/shoutouts", tags=["Shoutouts"])
app.include_router(users_router, prefix="/users", tags=["Users"])  # ← ADDED


@app.get("/")
def root():
    return {
        "message": "Welcome to BragBoard API",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
>>>>>>> origin/main-group-D
