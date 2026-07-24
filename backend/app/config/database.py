from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from app.config.settings import settings

client: AsyncMongoClient | None = None
db: AsyncDatabase | None = None

async def connect_to_mongo() -> None:
    global client, db
    client = AsyncMongoClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]
    await client.admin.command("ping")
    
async def close_mongo_connection() -> None:
    global client, db
    if client is not None:
        await client.close()
    client = None
    db = None

def get_db() -> AsyncDatabase:
    if db is None:
        raise RuntimeError("Database is not initialized")
    return db