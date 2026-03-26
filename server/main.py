from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from src.database.database import engine, Base
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.shoutouts.controller import router as shoutouts_router
from src.reports.controller import router as reports_router
from src.notifications.controller import router as notifications_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

# CORS setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory if it doesn't exist
if not os.path.exists("static"):
    os.makedirs("static")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to BragBoard API"}

# Include Modular Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(shoutouts_router)
app.include_router(reports_router)
app.include_router(notifications_router)
