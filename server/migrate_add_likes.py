# server/migrate_add_likes.py

from src.database.connection import Base, engine
from src.entities.shoutout_like import ShoutoutLike

print("Creating shoutout_likes table...")
Base.metadata.create_all(bind=engine)
print("✅ Migration complete!")