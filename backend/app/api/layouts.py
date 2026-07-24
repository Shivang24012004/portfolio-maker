from uuid import UUID
from fastapi import APIRouter, Depends, Query
from pymongo.asynchronous.database import AsyncDatabase
from app.config.database import get_db
from app.models.layout import Layout
from app.services.layout_service import LayoutService

router = APIRouter(prefix="/api/v1/layout")

def get_layout_service(db: AsyncDatabase = Depends(get_db)) -> LayoutService:
    return LayoutService(db)

@router.post("", response_model=Layout, status_code=201)
async def create_layout(layout: Layout, service: LayoutService = Depends(get_layout_service)):
    return await service.create(layout)

@router.get("", response_model=list[Layout])
async def list_layouts(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: LayoutService = Depends(get_layout_service),
):
    return await service.list(limit=limit, offset=offset)

@router.get("/{id}", response_model=Layout)
async def get_layout(
    id: UUID,
    service: LayoutService = Depends(get_layout_service),
):
    return await service.get_by_id(id)

@router.put("/{id}", response_model=Layout)
async def update_layout(
    id: UUID,
    layout: Layout,
    service: LayoutService = Depends(get_layout_service),
):
    return await service.update(id, layout)

@router.delete("/{id}", status_code=204)
async def delete_layout(
    id: UUID,
    service: LayoutService = Depends(get_layout_service),
):
    await service.delete(id)

