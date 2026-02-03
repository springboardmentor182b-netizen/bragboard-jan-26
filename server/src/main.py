from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.users.controller import router as user_router

app = FastAPI()

# Enable CORS so your frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the User/Log routes
app.include_router(user_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "BragBoard API is running correctly!"}