from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import Base, engine
from src.auth.controller import router as auth_router
from src.leaderboard.controller import router as leaderboard_router
from src.shoutouts.controller import router as shoutouts_router

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router)
app.include_router(leaderboard_router)
app.include_router(shoutouts_router, prefix="/shoutouts", tags=["Shoutouts"])


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

from src.entities.user import User
from src.database.connection import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

@app.get("/users", tags=["Users"])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "name": u.name, "department": u.department, "email": u.email} for u in users]