from fastapi import FastAPI
from src.core.database import Base, engine
from src.users.api import router as user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
