from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.core import engine, Base
from src.shoutouts import controller as shoutouts_controller
from src.entities import user, shoutout 
from src.entities.user import User
from src.database.core import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(shoutouts_controller.router, prefix="/shoutouts", tags=["Shoutouts"])

# Temporary User Route for Login
from src.entities.user import User
from src.database.core import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()