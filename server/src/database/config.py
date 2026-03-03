import os
from dotenv import load_dotenv
from pathlib import Path

# Get the directory containing this file, then go up to server directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

# Load environment variables from .env file
load_dotenv(ENV_PATH)


class Settings:
    """
    Application settings loaded from environment variables
    
    SECURITY NOTE: Never hardcode sensitive values!
    Always use environment variables for:
    - Database credentials
    - Secret keys
    - API keys
    - Passwords
    """
    
    # Database Configuration
    # NO FALLBACK - Force using environment variable
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # JWT Configuration
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Server Configuration
    HOST = os.getenv("HOST", "127.0.0.1")
    PORT = int(os.getenv("PORT", "8000"))
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    
    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    def __init__(self):
        """Validate critical settings on initialization"""
        self._validate_settings()
    
    def _validate_settings(self):
        """Check if critical settings are properly configured"""
        errors = []
        warnings = []
        
        # Check if DATABASE_URL is set
        if not self.DATABASE_URL:
            errors.append(
                "❌ CRITICAL: DATABASE_URL is not set!\n"
                "   Please add it to your .env file:\n"
                "   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/bragboard_db"
            )
        elif "password@localhost" in self.DATABASE_URL:
            warnings.append(
                "⚠️  WARNING: Possibly using default database credentials!\n"
                "   Please use a strong password in your .env file."
            )
        
        # Check if SECRET_KEY is set
        if not self.SECRET_KEY:
            errors.append(
                "❌ CRITICAL: SECRET_KEY is not set!\n"
                "   Generate a secure key and add it to your .env file:\n"
                "   Run: python -c \"import secrets; print(secrets.token_urlsafe(32))\"\n"
                "   Then add: SECRET_KEY=<generated-key>"
            )
        elif self.SECRET_KEY in [
            "your-secret-key-change-this-in-production",
            "INSECURE-KEY-CHANGE-THIS-IN-PRODUCTION"
        ]:
            warnings.append(
                "⚠️  WARNING: Using default SECRET_KEY!\n"
                "   Generate a secure key with:\n"
                "   python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        elif len(self.SECRET_KEY) < 32:
            warnings.append(
                "⚠️  WARNING: SECRET_KEY is too short! Should be at least 32 characters."
            )
        
        # Print errors (will prevent startup)
        if errors:
            print("\n" + "="*70)
            print("CONFIGURATION ERRORS - CANNOT START:")
            print("="*70)
            for error in errors:
                print(error)
            print("="*70 + "\n")
            raise ValueError(
                "Missing required environment variables. Please check your .env file!"
            )
        
        # Print warnings (for development)
        if warnings and self.ENVIRONMENT != "production":
            print("\n" + "="*70)
            print("SECURITY WARNINGS:")
            print("="*70)
            for warning in warnings:
                print(warning)
            print("="*70 + "\n")
        elif warnings and self.ENVIRONMENT == "production":
            # In production, warnings become errors
            print("\n" + "="*70)
            print("PRODUCTION SECURITY ERRORS:")
            print("="*70)
            for warning in warnings:
                print(warning.replace("⚠️  WARNING:", "❌ ERROR:"))
            print("="*70 + "\n")
            raise ValueError(
                "Cannot start in production with insecure configuration!"
            )


# Create settings instance
settings = Settings()


# Export for convenience
__all__ = ["settings"]