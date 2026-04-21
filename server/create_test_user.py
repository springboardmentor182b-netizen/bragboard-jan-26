from datetime import datetime

from sqlalchemy import create_engine, text

from src.auth.service import hash_password
from src.database.config import settings


def main() -> None:
    email = "ai.tester@bragboard.dev"
    name = "AI Tester"
    password = "Test@1234"

    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        tx = conn.begin()
        try:
            row = conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": email},
            ).fetchone()

            if row:
                conn.execute(
                    text(
                        """
                        UPDATE users
                        SET name = :name,
                            password = :password,
                            role = CAST('employee' AS userrole),
                            status = CAST('approved' AS userstatus),
                            approved_at = :approved_at
                        WHERE email = :email
                        """
                    ),
                    {
                        "name": name,
                        "password": hash_password(password),
                        "approved_at": datetime.utcnow(),
                        "email": email,
                    },
                )
                print("UPDATED")
            else:
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
                        "password": hash_password(password),
                        "department": "QA",
                        "approved_at": datetime.utcnow(),
                        "joined_at": datetime.utcnow(),
                        "question": "What is your favorite color?",
                        "answer": "blue",
                    },
                )
                print("CREATED")

            tx.commit()
        except Exception:
            tx.rollback()
            raise

    print(f"EMAIL: {email}")
    print(f"PASSWORD: {password}")


if __name__ == "__main__":
    main()
