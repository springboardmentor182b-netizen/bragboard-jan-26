from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.entities.shoutout import Shoutout
from src.entities.report import Report

# 1. Connect to your real database file
engine = create_engine("sqlite:///./bragboard.db") # Double check this filename!
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

try:
    # 2. Add a Sample Shoutout
    sample_shoutout = Shoutout(
        sender="Alex Rivera",
        receiver="Team",
        content="This presentation was absolute garbage!"
    )
    db.add(sample_shoutout)
    db.commit()
    db.refresh(sample_shoutout)

    # 3. Add a Report linked to that Shoutout ID
    sample_report = Report(
        shoutout_id=sample_shoutout.id,
        reason="Inappropriate Language",
        details="Used a banned word in the second sentence."
    )
    db.add(sample_report)
    db.commit()

    print(f"✅ Success! Added Report for Shoutout ID: {sample_shoutout.id}")

except Exception as e:
    print(f"❌ Error: {e}")
finally:
    db.close()