"""Authentication module initialization"""
from .service import register_user, login_user
from .controller import router

__all__ = ["register_user", "login_user", "router"]
