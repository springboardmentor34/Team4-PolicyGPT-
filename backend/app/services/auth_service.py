from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.crud.user import get_user_by_email, create_user
from app.models.user import User
from app.schemas.auth import RegisterRequest

class AuthService:

    @staticmethod
    def register(
        db: Session,
        user_data: RegisterRequest
        ):

        existing_user = get_user_by_email(
            db,
            user_data.email
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_password = hash_password(
            user_data.password
        )

        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password_hash=hashed_password,
            role=user_data.role,
            phone=user_data.phone,
            state=user_data.state
        )

        return create_user(db, new_user)