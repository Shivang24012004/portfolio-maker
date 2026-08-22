from datetime import datetime
from typing import Optional
from pydantic import EmailStr
from app.models.base import MongoModel

class User(MongoModel):
    first_name: str
    last_name: str
    email: EmailStr
    hashed_password: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_email_verified: bool = False
    last_login_at: Optional[datetime] = None