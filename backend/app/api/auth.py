from fastapi import APIRouter, Depends, status
from pymongo.asynchronous.database import AsyncDatabase
from app.api.deps import get_current_user
from app.config.database import get_db
from app.models.user import User
from app.schemas.auth import TokenResponse, UserLoginRequest, UserRegisterRequest, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

def get_auth_service(db: AsyncDatabase = Depends(get_db)) -> AuthService:
    return AuthService(db)

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    req: UserRegisterRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.register(req)

@router.post("/login", response_model=TokenResponse)
async def login(
    req: UserLoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.login(req)

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user
