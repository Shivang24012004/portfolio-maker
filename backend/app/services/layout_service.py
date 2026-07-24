from uuid import UUID
from fastapi import HTTPException
from pymongo.asynchronous.database import AsyncDatabase
from app.models.layout import Layout
from app.repository.layout_repository import LayoutRepository
from pymongo.errors import DuplicateKeyError

class LayoutService:
    def __init__(self, db: AsyncDatabase):
        self.db = db
        self.repo = LayoutRepository(db)

    async def create(self, layout: Layout) -> Layout:
        try:
            return await self.repo.create(layout)
        except DuplicateKeyError:
            raise HTTPException(status_code=409, detail="Layout with given ID already exists")
    
    async def get_by_id(self, layout_id: UUID) -> Layout:
        layout = await self.repo.get_by_id(layout_id)
        if not layout:
            raise HTTPException(status_code=404, detail="Layout not found")
        return layout
    
    async def list(self, limit: int = 20, offset: int = 0) -> list[Layout]:
        return await self.repo.list(limit, offset)
  
    async def update(self, id: UUID, layout: Layout) -> Layout:
        async with self.db.client.start_session() as session:
            async with await session.start_transaction():
                existing = await self.repo.get_by_id(id, session=session)
                if not existing:
                    raise HTTPException(status_code=404, detail="Layout not found")
                layout.id = id
                layout.version = existing.version + 1
                updated = await self.repo.update(layout, session=session)
                if not updated:
                    raise HTTPException(status_code=500, detail="Failed to update layout")
                return updated
    
    async def delete(self, layout_id: UUID) -> int:
        async with self.db.client.start_session() as session:
            async with await session.start_transaction():
                existing = await self.repo.get_by_id(layout_id, session=session)
                if not existing:
                    raise HTTPException(status_code=404, detail="Layout not found")
                deleted = await self.repo.delete(layout_id, session=session)
                if not deleted:
                    raise HTTPException(status_code=500, detail="Failed to delete layout")
                return deleted