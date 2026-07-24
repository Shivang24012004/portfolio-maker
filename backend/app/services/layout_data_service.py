from uuid import UUID
from fastapi import HTTPException
from pymongo.asynchronous.database import AsyncDatabase
from app.models.layout_data import LayoutData
from app.repository.layout_data_repository import LayoutDataRepository
from pymongo.errors import DuplicateKeyError

class LayoutDataService:
    def __init__(self, db: AsyncDatabase):
        self.db = db
        self.repo = LayoutDataRepository(db)

    async def create(self, layout_data: LayoutData) -> LayoutData:
        try:
            return await self.repo.create(layout_data)
        except DuplicateKeyError:
            raise HTTPException(status_code=409, detail="LayoutData with given ID already exists")
    
    async def get_by_id(self, layout_data_id: UUID) -> LayoutData:
        layout_data = await self.repo.get_by_id(layout_data_id)
        if not layout_data:
            raise HTTPException(status_code=404, detail="LayoutData not found")
        return layout_data
    
    async def list(self, limit: int = 20, offset: int = 0) -> list[LayoutData]:
        return await self.repo.list(limit, offset)
    
    async def get_by_layout_id(self, layout_id: str) -> LayoutData:
        layout_data = await self.repo.get_by_layout_id(layout_id)
        if not layout_data:
            raise HTTPException(status_code=404, detail="LayoutData not found for the given layout_id")
        return layout_data
  
    async def update(self, id: UUID, layout_data: LayoutData) -> LayoutData:
        async with self.db.client.start_session() as session:
            async with await session.start_transaction():
                existing = await self.repo.get_by_id(id, session=session)
                if not existing:
                    raise HTTPException(status_code=404, detail="LayoutData not found")
                layout_data.id = id
                layout_data.version = existing.version + 1
                updated = await self.repo.update(layout_data, session=session)
                if not updated:
                    raise HTTPException(status_code=500, detail="Failed to update LayoutData")
                return updated
    
    async def delete(self, layout_data_id: UUID) -> int:
        async with self.db.client.start_session() as session:
            async with await session.start_transaction():
                existing = await self.repo.get_by_id(layout_data_id, session=session)
                if not existing:
                    raise HTTPException(status_code=404, detail="LayoutData not found")
                deleted = await self.repo.delete(layout_data_id, session=session)
                if not deleted:
                    raise HTTPException(status_code=500, detail="Failed to delete LayoutData")
                return deleted