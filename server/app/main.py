from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.admin.router import router as admin_router
from src.database.core import engine, Base

# 1. Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI()

# 2. Add CORS (Essential for the React Client to talk to this Server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include the router
# We use prefix="" here because the admin_router usually already 
# has "/admin" defined inside it.
app.include_router(admin_router)

@app.get("/")
def root():
    return {"message": "Bragboard API is running"}