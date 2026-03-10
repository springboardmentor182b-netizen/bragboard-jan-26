import sys
import os

# Add the current directory to sys.path to allow imports from src
sys.path.append(os.getcwd())

from src.core.database import engine, Base
# Import all models here to ensure they are registered with Base
from src.users.models import User
from src.entities.shoutout import Shoutout

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
