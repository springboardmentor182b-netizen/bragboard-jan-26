from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables using pydantic-settings.
    Includes database credentials, JWT security, and server configuration.
    """

    # Database Configuration
    # In production, set DATABASE_URL directly (e.g. Neon connection string).
    # For local dev, individual POSTGRES_* vars are used as fallback.
    DATABASE_URL_OVERRIDE: Optional[str] = Field(default=None, validation_alias="DATABASE_URL")
    POSTGRES_USER: str = "bragboard_user"
    POSTGRES_PASSWORD: str = "bragboard_pass"
    POSTGRES_DB: str = "bragboard_db"
    POSTGRES_HOST: str = "db"
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

    # Gemini AI Configuration
    GEMINI_API_KEY: str = ""

    @property
    def DATABASE_URL(self) -> str:
        # Prefer a direct DATABASE_URL env var (Neon, Render, etc.)
        if self.DATABASE_URL_OVERRIDE:
            return self.DATABASE_URL_OVERRIDE
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def cors_origins_list(self) -> List[str]:
        return self.CORS_ORIGINS.split(",")

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
