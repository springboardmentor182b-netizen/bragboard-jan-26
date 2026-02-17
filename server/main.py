from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.config import settings
from src.database.core import Base
from src.database.connection import engine

# Import entities to ensure they are registered with Base.metadata
from src.entities.user import User
from src.entities.tag import Tag
from src.entities.shoutout import Shoutout
from src.entities.comment import Comment
from src.entities.reaction import Reaction

def get_application():
    # Create tables
    Base.metadata.create_all(bind=engine)

    _app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Import routers
    from src.auth.controller import router as auth_router
    from src.users.controller import router as users_router
    from src.shoutouts.controller import router as shoutouts_router

    _app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
    _app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
    _app.include_router(shoutouts_router, prefix=f"{settings.API_V1_STR}/shoutouts", tags=["shoutouts"])

    return _app

app = get_application()

@app.get("/")
def root():
    return {"message": "Welcome to BragBoard API"}
