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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routes
app.include_router(api_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
