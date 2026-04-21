from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.admin.router import router as admin_router
from src.users.controller import router as users_router
from src.shoutouts.controller import router as shoutouts_router
from src.database.core import engine, Base

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(shoutouts_router, prefix="/shoutouts", tags=["shoutouts"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "BragBoard API is running"}
