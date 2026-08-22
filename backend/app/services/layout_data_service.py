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

    async def create(self, layout_data: LayoutData, user_id: UUID) -> LayoutData:
        layout_data.user_id = user_id
        try:
            return await self.repo.create(layout_data)
        except DuplicateKeyError:
            raise HTTPException(status_code=409, detail="Portfolio with given ID already exists")
    
    async def get_by_id(self, layout_data_id: UUID) -> LayoutData:
        layout_data = await self.repo.get_by_id(layout_data_id)
        if not layout_data:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        return layout_data
    
    async def list(self, user_id: UUID, limit: int = 50, offset: int = 0) -> list[LayoutData]:
        return await self.repo.list_by_user(user_id, limit, offset)
  
    async def update(self, id: UUID, user_id: UUID, layout_data: LayoutData) -> LayoutData:
        async with self.db.client.start_session() as session:
            async with await session.start_transaction():
                existing = await self.repo.get_by_id_and_user(id, user_id, session=session)
                if not existing:
                    raise HTTPException(status_code=404, detail="Portfolio not found")
                layout_data.id = id
                layout_data.user_id = user_id
                layout_data.created_at = existing.created_at
                layout_data.version = existing.version + 1
                updated = await self.repo.update(layout_data, session=session)
                if not updated:
                    raise HTTPException(status_code=500, detail="Failed to update Portfolio")
                return updated
    
    async def delete(self, layout_data_id: UUID, user_id: UUID) -> int:
        async with self.db.client.start_session() as session:
            async with await session.start_transaction():
                existing = await self.repo.get_by_id_and_user(layout_data_id, user_id, session=session)
                if not existing:
                    raise HTTPException(status_code=404, detail="Portfolio not found")
                deleted = await self.repo.delete_by_id_and_user(layout_data_id, user_id, session=session)
                if not deleted:
                    raise HTTPException(status_code=500, detail="Failed to delete Portfolio")
                return deleted
