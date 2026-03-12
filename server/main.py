from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import Base, engine
from src.admin.controller import router as admin_router

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# create tables
Base.metadata.create_all(bind=engine)

# Admin routes
app.include_router(admin_router)


@app.get("/")
def read_root():
    return {"message": "BragBoard API running"}