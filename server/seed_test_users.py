from datetime import datetime

from sqlalchemy import create_engine, text

from src.auth.service import hash_password
from src.database.config import settings


def main() -> None:
    engine = create_engine(settings.DATABASE_URL)
    users = [
        ("Aisha Khan", "aisha.test@bragboard.dev", "Engineering"),
        ("Rohan Patel", "rohan.test@bragboard.dev", "Product"),
        ("Maya Singh", "maya.test@bragboard.dev", "Design"),
        ("Daniel Lee", "daniel.test@bragboard.dev", "Marketing"),
    ]

    created: list[str] = []
    skipped: list[str] = []
    password_hash = hash_password("Test@1234")

    with engine.connect() as conn:
        tx = conn.begin()
        try:
            for name, email, department in users:
                exists = conn.execute(
                    text("SELECT id FROM users WHERE email = :email"),
                    {"email": email},
                ).fetchone()
                if exists:
                    skipped.append(email)
                    continue

                conn.execute(
                    text(
                        """
                        INSERT INTO users
                          (name, email, password, department, role, status,
                           approved_at, joined_at, security_question, security_answer)
                        VALUES
                          (:name, :email, :password, :department,
                           CAST('employee' AS userrole), CAST('approved' AS userstatus),
                           :approved_at, :joined_at, :question, :answer)
                        """
                    ),
                    {
                        "name": name,
                        "email": email,
                        "password": password_hash,
                        "department": department,
                        "approved_at": datetime.utcnow(),
                        "joined_at": datetime.utcnow(),
                        "question": "What is your favorite color?",
                        "answer": "blue",
                    },
                )
                created.append(email)
            tx.commit()
        except Exception:
            tx.rollback()
            raise

    print("CREATED:", ", ".join(created) if created else "none")
    print("SKIPPED:", ", ".join(skipped) if skipped else "none")
    print("PASSWORD: Test@1234")


if __name__ == "__main__":
    main()
