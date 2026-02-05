from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

# Import entities BEFORE creating tables
from src.entities.user import User
from src.entities.shoutout import ShoutOut, ShoutOutRecipient
from src.entities.comment import Comment
from src.entities.reaction import Reaction

from src.database.connection import engine, Base
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.categories.controller import router as categories_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(categories_router)

@app.get("/")
def root():
    return {"message": "BragBoard API is running", "version": "1.0.0"}
