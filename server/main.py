from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import Base, engine
from src.users.controller import router as users_router

app = FastAPI(
    title="BragBoard API",
    description="BragBoard Employee Dashboard API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)

# Mount users router at /api/users
app.include_router(users_router, prefix="/api/users", tags=["Users"])


@app.get("/")
def root():
    return {
        "message": "BragBoard API is running!",
        "endpoints": {
            "dashboard": "/api/users/employee/{user_id}",
            "employees": "/api/users/employees",
            "feed":      "/api/users/feed",
            "leaderboard": "/api/users/leaderboard",
            "docs":      "/docs"
        }
    }
