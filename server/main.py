from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.controller import router as auth_router

# Create FastAPI application
app = FastAPI(
    title="BragBoard API",
    description="Internal Employee Recognition Platform",
    version="1.0.0"
)

# Configure CORS - UPDATED to fix OPTIONS request issue
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Both localhost variations
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
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