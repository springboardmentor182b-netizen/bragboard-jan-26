from fastapi import FastAPI
from src.api import api_router
from src.database.core import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard Backend")

app.include_router(api_router)
