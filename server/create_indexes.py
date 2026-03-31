from sqlalchemy import text
from src.database.connection import engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

INDEXES = [
    # Shoutouts
    "CREATE INDEX IF NOT EXISTS idx_shoutouts_sender ON shoutouts(sender_id)",
    "CREATE INDEX IF NOT EXISTS idx_shoutouts_created ON shoutouts(created_at DESC)",
    "CREATE INDEX IF NOT EXISTS idx_shoutouts_likes ON shoutouts(likes DESC)",
    
    # Recipients (most important for performance)
    "CREATE INDEX IF NOT EXISTS idx_recipients_recipient ON shoutout_recipients(recipient_id)",
    "CREATE INDEX IF NOT EXISTS idx_recipients_shoutout ON shoutout_recipients(shoutout_id)",
    "CREATE INDEX IF NOT EXISTS idx_recipients_both ON shoutout_recipients(recipient_id, shoutout_id)",
    
    # Likes
    "CREATE INDEX IF NOT EXISTS idx_likes_shoutout ON shoutout_likes(shoutout_id)",
    "CREATE INDEX IF NOT EXISTS idx_likes_user ON shoutout_likes(user_id)",
    
    # Users
    "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
    "CREATE INDEX IF NOT EXISTS idx_users_department ON users(department)",
    "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)",
]

def create_indexes():
    """Create all performance indexes."""
    with engine.connect() as conn:
        for idx_sql in INDEXES:
            try:
                logger.info(f"Creating index: {idx_sql[:60]}...")
                conn.execute(text(idx_sql))
                conn.commit()
                logger.info("✅ Success")
            except Exception as e:
                logger.error(f"❌ Failed: {e}")
                conn.rollback()

if __name__ == "__main__":
    create_indexes()
    logger.info("🎉 All indexes created!")