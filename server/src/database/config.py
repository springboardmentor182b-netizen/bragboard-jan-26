import os

from pydantic_settings import BaseSettings
from typing import List, Optional

# Compute absolute path to server/.env so it loads correctly regardless of CWD
_ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables using pydantic-settings.
    Includes database credentials, JWT security, and server configuration.
    """

    # Database Configuration
    POSTGRES_USER: str = "bragboard_user"
    POSTGRES_PASSWORD: str = "bragboard_pass"
    POSTGRES_DB: str = "bragboard_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # Default 30 days in minutes

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def cors_origins_list(self) -> List[str]:
        return self.CORS_ORIGINS.split(",")

    class Config:
        env_file = _ENV_FILE
        extra = "ignore"


settings = Settings()
