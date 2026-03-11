from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import api_router
from src.database.core import engine, Base 

# Create the tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "Server is running"}