<<<<<<< HEAD
"""
BragBoard API - Main Entry Point
FastAPI backend for employee recognition platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import engine, Base
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.entities.controller import router as shoutouts_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="BragBoard API",
    description="Internal Employee Recognition Platform API",
    version="1.0.0",
)

# CORS Configuration - Allow React frontend to connect
origins = [
    "http://localhost:3000",  # React dev server
    "http://localhost:8000",  # FastAPI server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers with prefixes
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(shoutouts_router, prefix="/api/shoutouts", tags=["Shout-outs"])

# Root endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "BragBoard API is running!",
        "status": "healthy",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "api_version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
=======
from fastapi import FastAPI
from src.core.database import Base, engine
from src.users.api import router as user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
>>>>>>> ff6b9ac298133bc779a2d2610a3f4eda536800c3
