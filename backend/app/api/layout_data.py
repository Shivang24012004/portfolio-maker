from uuid import UUID
from fastapi import APIRouter, Depends, Query
from pymongo.asynchronous.database import AsyncDatabase
from app.config.database import get_db
from app.models.layout_data import LayoutData
from app.services.layout_data_service import LayoutDataService

router = APIRouter(prefix="/api/v1/layout_data", tags=["layout_data"])

def get_layout_data_service(db: AsyncDatabase = Depends(get_db)) -> LayoutDataService:
    return LayoutDataService(db)

@router.post("", response_model=LayoutData, status_code=201)
async def create_layout_data(layout_data: LayoutData, service: LayoutDataService = Depends(get_layout_data_service)):
    return await service.create(layout_data)

@router.get("", response_model=list[LayoutData])
async def list_layout_data(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: LayoutDataService = Depends(get_layout_data_service),
):
    return await service.list(limit=limit, offset=offset)

@router.get("/{id}", response_model=LayoutData)
async def get_layout_data(
    id: UUID,
    service: LayoutDataService = Depends(get_layout_data_service),
):
    return await service.get_by_id(id)

@router.put("/{id}", response_model=LayoutData)
async def update_layout_data(
    id: UUID,
    layout_data: LayoutData,
    service: LayoutDataService = Depends(get_layout_data_service),
):
    return await service.update(id, layout_data)

@router.delete("/{id}", status_code=204)
async def delete_layout_data(
    id: UUID,
    service: LayoutDataService = Depends(get_layout_data_service),
):
    await service.delete(id)
