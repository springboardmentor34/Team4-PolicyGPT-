from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    return AuthService.register(
        db,
        request
    )


from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    return AuthService.login(
        db,
        request
    )

@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Swagger sends username, we treat it as email
    request = LoginRequest(email=form_data.username, password=form_data.password)
    return AuthService.login(
        db,
        request
    )