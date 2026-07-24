from pymongo.asynchronous.database import AsyncDatabase
from app.models.layout import Layout
from app.repository.base_repository import BaseRepository
from app.utils.mongo import from_doc

LayoutCollection = "layouts"

class LayoutRepository(BaseRepository[Layout]):
    def __init__(self, db: AsyncDatabase):
        super().__init__(db, LayoutCollection, Layout)

    async def list(self, limit: int = 20, offset: int = 0) -> list[Layout]:
        cursor = self.col.find({"parent_id": None}).skip(offset).limit(limit)
        return [from_doc(Layout, doc) async for doc in cursor]
