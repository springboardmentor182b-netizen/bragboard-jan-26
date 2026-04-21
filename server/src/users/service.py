from sqlalchemy.orm import Session
from src.entities.user import User
from src.entities.shoutout import ShoutOut
from src.entities.shoutout_recipient import ShoutOutRecipient
from src.users.models import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    @staticmethod
    def get_password_hash(password):
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_user(db: Session, user: UserCreate):
        hashed_password = UserService.get_password_hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            role=user.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str):
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def get_user_stats(db: Session, user_id: int):
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return None
        
        # Count shoutouts received
        received_count = db.query(ShoutOutRecipient).filter(
            ShoutOutRecipient.recipient_id == user_id
        ).count()
        
        # Count shoutouts sent
        sent_count = db.query(ShoutOut).filter(
            ShoutOut.sender_id == user_id
        ).count()
        
        return {
            "user_id": user_id,
            "username": user.username,
            "shoutouts_received": received_count,
            "shoutouts_sent": sent_count
        }
