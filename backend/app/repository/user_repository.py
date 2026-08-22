from app.models.user import User
from pymongo.asynchronous.database import AsyncDatabase
from app.repository.base_repository import BaseRepository
from app.utils.mongo import from_doc

UserCollection = "user"

class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncDatabase):
        super().__init__(db, UserCollection, User)

    async def get_by_email(self, email: str) -> User | None:
        doc = await self.col.find_one({"email": email})
        return from_doc(self.model, doc) if doc else None