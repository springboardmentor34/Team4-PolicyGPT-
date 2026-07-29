from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    @staticmethod
    def register(db: Session, user_data):
        
        #Register a new user.
        
        pass


    @staticmethod
    def login(db: Session, email: str, password: str):
        
        #Authenticate a user.
        
        pass