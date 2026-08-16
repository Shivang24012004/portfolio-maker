from pymongo.asynchronous.database import AsyncDatabase
from app.models.layout_data import LayoutData
from app.repository.base_repository import BaseRepository
from app.utils.mongo import from_doc

LayoutDataCollection = "layout_data"

class LayoutDataRepository(BaseRepository[LayoutData]):
    def __init__(self, db: AsyncDatabase):
        super().__init__(db, LayoutDataCollection, LayoutData)

    async def list(self, limit: int = 50, offset: int = 0) -> list[LayoutData]:
        cursor = self.col.find().skip(offset).limit(limit)
        return [from_doc(LayoutData, doc) async for doc in cursor]
