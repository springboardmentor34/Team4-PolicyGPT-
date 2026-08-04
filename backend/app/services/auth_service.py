from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

from app.crud.user import (
    get_user_by_email,
    create_user,
)

from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest

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


    @staticmethod
    def login(
        db: Session,
        login_data: LoginRequest
    ):

        user = get_user_by_email(
            db,
            login_data.email
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not verify_password(
            login_data.password,
            str(user.password_hash)
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        access_token = create_access_token(
            data={
                "sub": user.email,
                "role": user.role.value
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }