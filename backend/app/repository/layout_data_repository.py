from uuid import UUID
from pymongo.asynchronous.client_session import AsyncClientSession
from pymongo.asynchronous.database import AsyncDatabase
from app.models.layout_data import LayoutData
from app.repository.base_repository import BaseRepository
from app.utils.mongo import from_doc

LayoutDataCollection = "layout_data"

class LayoutDataRepository(BaseRepository[LayoutData]):
    def __init__(self, db: AsyncDatabase):
        super().__init__(db, LayoutDataCollection, LayoutData)

    async def list_by_user(self, user_id: UUID, limit: int = 50, offset: int = 0) -> list[LayoutData]:
        cursor = self.col.find({"user_id": str(user_id)}).skip(offset).limit(limit)
        return [from_doc(LayoutData, doc) async for doc in cursor]

    async def get_by_id_and_user(self, entity_id: UUID, user_id: UUID, session: AsyncClientSession | None = None) -> LayoutData | None:
        doc = await self.col.find_one({"id": str(entity_id), "user_id": str(user_id)}, session=session)
        return from_doc(self.model, doc) if doc else None

    async def delete_by_id_and_user(self, entity_id: UUID, user_id: UUID, session: AsyncClientSession | None = None) -> int:
        result = await self.col.delete_one({"id": str(entity_id), "user_id": str(user_id)}, session=session)
        return result.deleted_count
