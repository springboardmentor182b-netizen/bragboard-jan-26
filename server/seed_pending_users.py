from datetime import datetime

from sqlalchemy import create_engine, text

from src.auth.service import hash_password
from src.database.config import settings


def main() -> None:
    engine = create_engine(settings.DATABASE_URL)
    users = [
        ("Pending One", "pending1@bragboard.dev", "Engineering"),
        ("Pending Two", "pending2@bragboard.dev", "Design"),
        ("Pending Three", "pending3@bragboard.dev", "HR"),
    ]
    password_hash = hash_password("Test@1234")

    created: list[str] = []
    updated: list[str] = []

    with engine.connect() as conn:
        tx = conn.begin()
        try:
            for name, email, department in users:
                exists = conn.execute(
                    text("SELECT id FROM users WHERE email = :email"),
                    {"email": email},
                ).fetchone()

                if exists:
                    conn.execute(
                        text(
                            """
                            UPDATE users
                            SET status = CAST('pending' AS userstatus),
                                role = CAST('employee' AS userrole),
                                approved_at = NULL,
                                approved_by = NULL
                            WHERE email = :email
                            """
                        ),
                        {"email": email},
                    )
                    updated.append(email)
                    continue

                conn.execute(
                    text(
                        """
                        INSERT INTO users
                          (name, email, password, department, role, status,
                           joined_at, security_question, security_answer)
                        VALUES
                          (:name, :email, :password, :department,
                           CAST('employee' AS userrole), CAST('pending' AS userstatus),
                           :joined_at, :question, :answer)
                        """
                    ),
                    {
                        "name": name,
                        "email": email,
                        "password": password_hash,
                        "department": department,
                        "joined_at": datetime.utcnow(),
                        "question": "What is your favorite color?",
                        "answer": "blue",
                    },
                )
                created.append(email)

            pending_count = conn.execute(
                text("SELECT COUNT(*) FROM users WHERE status = CAST('pending' AS userstatus)")
            ).scalar()
            tx.commit()
        except Exception:
            tx.rollback()
            raise

    print("CREATED:", ", ".join(created) if created else "none")
    print("UPDATED_TO_PENDING:", ", ".join(updated) if updated else "none")
    print("PENDING_COUNT:", pending_count)
    print("PASSWORD: Test@1234")


if __name__ == "__main__":
    main()
