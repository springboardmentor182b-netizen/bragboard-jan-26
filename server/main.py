from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.config import Base, engine
from src.users.controller import router as users_router
from src.shoutouts.controller import router as shoutouts_router
from src.shoutouts.comments import router as comments_router
from src.shoutouts.reactions import router as reactions_router
from dotenv import load_dotenv
import os

load_dotenv()

# Create tables
from src.shoutouts.controller import router as shoutouts_router
from src.reports.controller import router as reports_router
from src.leaderboard.controller import router as leaderboard_router  # ← NEW

# Import all models to create tables
from src.users.models import User
from src.shoutouts.models import ShoutOut
from src.reports.models import Report

# Create database tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(shoutouts_router, prefix="/api/shoutouts", tags=["Shoutouts"])
app.include_router(comments_router, prefix="/api/comments", tags=["Comments"])
app.include_router(reactions_router, prefix="/api/reactions", tags=["Reactions"])
app.include_router(auth_router,         prefix="/api/auth",         tags=["Authentication"])
app.include_router(users_router,        prefix="/api/users",        tags=["Users"])
app.include_router(shoutouts_router,    prefix="/api/shoutouts",    tags=["Shoutouts"])
app.include_router(reports_router,      prefix="/api/reports",      tags=["Reports"])
app.include_router(leaderboard_router,  prefix="/api/leaderboard",  tags=["Leaderboard"])  # ← NEW

@app.get("/")
def root():
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    return {
        "message": "BragBoard API is running",
        "version": "1.0.0",
        "base_url": base_url,
        "docs": f"{base_url}/docs",
        "endpoints": {
            "users": f"{base_url}/api/users",
            "shoutouts": f"{base_url}/api/shoutouts",
            "comments": f"{base_url}/api/comments",
            "reactions": f"{base_url}/api/reactions"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "BragBoard API"}

if __name__ == "__main__":
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

    print("Starting BragBoard API server...")
    print("Server will run at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
