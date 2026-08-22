from typing import Generic, TypeVar
from uuid import UUID
from datetime import datetime, timezone
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.asynchronous.client_session import AsyncClientSession
from app.models.base import MongoModel
from app.utils.mongo import to_doc, from_doc

T = TypeVar("T", bound=MongoModel)

class BaseRepository(Generic[T]):
    def __init__(self, db: AsyncDatabase, collection: str, model: type[T]):
        self.col = db[collection]
        self.model = model

    async def create(self, entity: T, session: AsyncClientSession | None = None) -> T:
        entity.created_at = datetime.now(timezone.utc)
        entity.updated_at = datetime.now(timezone.utc)
        await self.col.insert_one(to_doc(entity), session=session)
        return entity

    async def get_by_id(self, entity_id: UUID, session: AsyncClientSession | None = None) -> T | None:
        doc = await self.col.find_one({"id": str(entity_id)}, session=session)
        return from_doc(self.model, doc) if doc else None

    async def update(self, entity: T, session: AsyncClientSession | None = None) -> T | None:
        entity.updated_at = datetime.now(timezone.utc)
        result = await self.col.replace_one({"id": str(entity.id)}, to_doc(entity), session=session)
        if result.matched_count == 0:
            return None
        return entity

    async def delete(self, id: UUID, session: AsyncClientSession | None = None) -> int:
        result = await self.col.delete_one({"id": str(id)}, session=session)
        return result.deleted_count
