import os

# Database connection settings
class Settings:
    # PostgreSQL connection details
    # Format: postgresql://username:password@host:port/database_name
    
    DATABASE_URL = "postgresql://postgres:password@localhost:5432/bragboard_db"
    
    # Secret key for JWT tokens (used for encrypting tokens)
    SECRET_KEY = "your-secret-key-change-this-in-production"
    
    # Algorithm used for JWT encoding
    ALGORITHM = "HS256"
    
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create a settings instance
settings = Settings()