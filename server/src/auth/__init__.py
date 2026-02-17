"""Authentication module initialization"""
from .service import AuthService
from .controller import router

__all__ = ["AuthService", "router"]
