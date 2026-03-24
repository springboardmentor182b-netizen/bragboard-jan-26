from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.core import Base, engine
from src.auth.controller import router as auth_router  # ← change this

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)  # ← change this