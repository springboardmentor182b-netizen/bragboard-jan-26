import sys
import os
sys.path.append(os.getcwd())
from src.core.database import SessionLocal
from src.entities.shoutout import Shoutout
from src.api.v1.shoutouts.schemas import ShoutoutOut
from sqlalchemy.orm import joinedload

def test():
    db = SessionLocal()
    try:
        shoutouts = db.query(Shoutout).options(
            joinedload(Shoutout.sender),
            joinedload(Shoutout.receiver),
            joinedload(Shoutout.reactions),
            joinedload(Shoutout.comments).joinedload(Shoutout.comments.property.mapper.class_.user) # Correct way for deep join
        ).all()
        print(f"Found {len(shoutouts)} shoutouts")
        for s in shoutouts:
            data = ShoutoutOut.from_orm(s)
            print(f"Serialized ID {s.id}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test()
