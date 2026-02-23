from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import engine, Base
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.entities.controller import router as shoutouts_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BragBoard API",
    description="Internal Employee Recognition Platform API",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(shoutouts_router, prefix="/api/shoutouts", tags=["Shout-outs"])


@app.get("/")
async def root():
    return {"message": "BragBoard API running"}