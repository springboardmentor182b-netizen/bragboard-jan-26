from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.controller import router as auth_router
from src.database.connection import engine, Base
from src.entities.user import User  # Importing this registers the table model

# --- DATABASE SETUP (CRITICAL FIX) ---
# This line creates the 'users' table in the database if it doesn't exist
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(
    title="BragBoard API",
    description="Internal Employee Recognition Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Register authentication routes
app.include_router(auth_router)

# Root endpoint (for testing)
@app.get("/")
def root():
    return {
        "message": "Welcome to BragBoard API",
        "status": "running",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}
