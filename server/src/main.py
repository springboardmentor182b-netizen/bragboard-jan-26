from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# This imports the "hallway" to your moderation room
from src.moderation.controller import router as moderation_router
from src.shoutouts.controller import router as shoutouts_router

app = FastAPI(title="BragBoard API")

# Allows your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connects your moderation feature to the main app
app.include_router(moderation_router)
app.include_router(shoutouts_router)

@app.get("/")
def root():
    return {"message": "BragBoard Backend is Running!"}