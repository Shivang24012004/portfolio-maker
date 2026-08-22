from datetime import datetime, timezone
from fastapi import HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase
from app.models.user import User
from app.repository.user_repository import UserRepository
from app.schemas.auth import TokenResponse, UserLoginRequest, UserRegisterRequest, UserResponse
from app.utils.security import create_access_token, hash_password, verify_password

class AuthService:
    def __init__(self, db: AsyncDatabase):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, req: UserRegisterRequest) -> TokenResponse:
        existing = await self.user_repo.get_by_email(req.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists",
            )

        hashed = hash_password(req.password)
        user = User(
            first_name=req.first_name,
            last_name=req.last_name,
            email=req.email,
            hashed_password=hashed,
            phone=req.phone,
            avatar_url=req.avatar_url,
            is_email_verified=False,
        )

        created_user = await self.user_repo.create(user)
        access_token = create_access_token(data={"sub": str(created_user.id)})

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(created_user),
        )

    async def login(self, req: UserLoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(req.email)
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user.last_login_at = datetime.now(timezone.utc)
        await self.user_repo.update(user)

        access_token = create_access_token(data={"sub": str(user.id)})
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
