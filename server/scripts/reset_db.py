import sys
import os
sys.path.append(os.getcwd())
from src.core.database import engine, Base
from src.users.models import User
from src.entities.shoutout import Shoutout, ShoutoutComment, ShoutoutReaction

def recreate():
    # Only drop these if they exist
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    print("Database recreated.")

if __name__ == "__main__":
    recreate()
