"""
BragBoard API - Main Entry Point
FastAPI backend for employee recognition platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import engine, Base
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router

# Import all models to create tables
from src.users.models import User

# Create database tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")

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
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])

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
    print("Starting BragBoard API server...")
    print("Server will run at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
