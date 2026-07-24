from fastapi import APIRouter, Depends
from pymongo.asynchronous.database import AsyncDatabase
from app.config.database import get_db

router = APIRouter(prefix="/api/v1")

@router.get("/health")
async def health(db: AsyncDatabase = Depends(get_db)):
    await db.command("ping")
    return {"status": "ok", "database": "connected"}
