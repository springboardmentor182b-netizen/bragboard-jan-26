from fastapi import FastAPI
from src.auth import router as auth_router

app = FastAPI(
    title="BragBoard API",
    description="Backend API for BragBoard project",
    version="1.0.0"
)

# register auth routes
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "BragBoard backend is running"}